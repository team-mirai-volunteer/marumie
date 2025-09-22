import type { SankeyData, SankeyLink, SankeyNode } from "@/types/sankey";
import type { SankeyCategoryAggregationResult } from "../repositories/interfaces/transaction-repository.interface";
import { createSafariCompatibleId } from "./sankey-id-utils";

// サブカテゴリ表示の上限設定
const SUBCATEGORY_LIMITS = {
  INCOME: 8,
  EXPENSE: 10,
} as const;

/**
 * サブカテゴリが10個になるように閾値を動的計算する処理
 */
function calculateDynamicThreshold(
  items: Array<{ subcategory?: string; totalAmount: number }>,
  targetCount: number,
): number {
  // サブカテゴリのみを対象とする
  const subcategoryItems = items.filter((item) => item.subcategory);

  // サブカテゴリの個数が目標以下の場合は閾値を0にして統合しない
  if (subcategoryItems.length <= targetCount) {
    return 0;
  }

  // 金額で降順ソート
  const sortedItems = [...subcategoryItems].sort(
    (a, b) => b.totalAmount - a.totalAmount,
  );

  // 全体の合計金額を計算して1%を求める
  const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);
  const onePercentThreshold = totalAmount * 0.01;

  // 上位targetCount個目の金額を閾値とする
  // これにより、上位targetCount-1個 + その他1個 = 合計targetCount個になる
  const dynamicThreshold = sortedItems[targetCount - 1].totalAmount;

  // 動的閾値と1%閾値の最大値を返す（最低でも1%は保証）
  return Math.max(dynamicThreshold, onePercentThreshold);
}

/**
 * 小項目をまとめる処理（動的閾値）
 */
function consolidateSmallItems(
  aggregation: SankeyCategoryAggregationResult,
  isFriendlyCategory: boolean = false,
): SankeyCategoryAggregationResult {
  if (!isFriendlyCategory) {
    return aggregation;
  }

  // サブカテゴリが設定個数になるように閾値を動的計算
  const incomeThreshold = calculateDynamicThreshold(
    aggregation.income,
    SUBCATEGORY_LIMITS.INCOME,
  );
  const expenseThreshold = calculateDynamicThreshold(
    aggregation.expense,
    SUBCATEGORY_LIMITS.EXPENSE,
  );

  // 収入の処理 - カテゴリ別に閾値以下を集計
  const consolidatedIncome: typeof aggregation.income = [];
  const smallIncomeByCategory = new Map<string, number>();

  for (const item of aggregation.income) {
    if (item.subcategory && item.totalAmount < incomeThreshold) {
      const current = smallIncomeByCategory.get(item.category) || 0;
      smallIncomeByCategory.set(item.category, current + item.totalAmount);
    } else {
      consolidatedIncome.push(item);
    }
  }

  // カテゴリ別に閾値以下の合計項目を追加
  for (const [category, total] of smallIncomeByCategory) {
    if (total > 0) {
      consolidatedIncome.push({
        category,
        subcategory: `その他(${category})`,
        totalAmount: total,
      });
    }
  }

  // 支出の処理 - カテゴリ別に閾値以下を集計
  const consolidatedExpense: typeof aggregation.expense = [];
  const smallExpenseByCategory = new Map<string, number>();

  for (const item of aggregation.expense) {
    if (item.subcategory && item.totalAmount < expenseThreshold) {
      const current = smallExpenseByCategory.get(item.category) || 0;
      smallExpenseByCategory.set(item.category, current + item.totalAmount);
    } else {
      consolidatedExpense.push(item);
    }
  }

  // カテゴリ別に閾値以下の合計項目を追加
  for (const [category, total] of smallExpenseByCategory) {
    if (total > 0) {
      consolidatedExpense.push({
        category,
        subcategory: `その他（${category}）`,
        totalAmount: total,
      });
    }
  }

  return {
    income: consolidatedIncome,
    expense: consolidatedExpense,
  };
}

/**
 * category集計データを5層サンキーデータに変換
 * subcategoryがあるものは5層、ないものは3層になる
 */
/**
 * 「その他」カテゴリを収入・支出別にリネームする処理
 */
function renameOtherCategories(
  aggregation: SankeyCategoryAggregationResult,
): SankeyCategoryAggregationResult {
  const income = aggregation.income.map((item) => ({
    ...item,
    category: item.category === "その他" ? "その他の収入" : item.category,
  }));

  const expense = aggregation.expense.map((item) => ({
    ...item,
    category: item.category === "その他" ? "その他の支出" : item.category,
  }));

  return { income, expense };
}

export function convertCategoryAggregationToSankeyData(
  aggregation: SankeyCategoryAggregationResult,
  isFriendlyCategory: boolean = false,
  currentYearBalance: number,
  previousYearBalance: number,
  unrealizedExpensesTotal: number = 0,
): SankeyData {
  // 「その他」カテゴリをリネーム
  const renamedAggregation = renameOtherCategories(aggregation);

  // 親しみやすいカテゴリーの場合は1%以下の項目を統合
  const processedAggregation = consolidateSmallItems(
    renamedAggregation,
    isFriendlyCategory,
  );

  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  // ノードIDの重複を避けるためのSet
  const nodeIds = new Set<string>();

  // 収入データの処理: subcategoryがあるものとないものを分別
  const incomeByCategory = new Map<string, number>();

  // previousYearBalanceが0より大きい場合、「昨年からの繰越し」として収入側に追加
  if (previousYearBalance > 0) {
    // 収入データに「昨年からの繰越し」レコードを追加（UI用）
    processedAggregation.income.push({
      category: "昨年からの繰越し",
      totalAmount: previousYearBalance,
    });
  }

  // 1. 収入サブカテゴリノード（subcategoryがあるもの）
  for (const item of processedAggregation.income) {
    if (item.subcategory) {
      const nodeId = createSafariCompatibleId(`income-sub-${item.subcategory}`);
      if (!nodeIds.has(nodeId)) {
        nodes.push({
          id: nodeId,
          label: item.subcategory,
          nodeType: "income-sub",
        });
        nodeIds.add(nodeId);
      }
    }

    // カテゴリ別の合計を計算
    const current = incomeByCategory.get(item.category) || 0;
    incomeByCategory.set(item.category, current + item.totalAmount);
  }

  // 2. 収入カテゴリノード
  for (const category of incomeByCategory.keys()) {
    const nodeId = createSafariCompatibleId(`income-${category}`);
    if (!nodeIds.has(nodeId)) {
      nodes.push({
        id: nodeId,
        label: category,
        nodeType: "income",
      });
      nodeIds.add(nodeId);
    }
  }

  // 3. 中央の合計ノード
  nodes.push({
    id: createSafariCompatibleId("合計"),
    label: "合計",
    nodeType: "total",
  });

  // 支出データの処理
  const expenseByCategory = new Map<string, number>();

  // 4. 支出カテゴリノード
  for (const item of processedAggregation.expense) {
    // カテゴリ別の合計を計算
    const current = expenseByCategory.get(item.category) || 0;
    expenseByCategory.set(item.category, current + item.totalAmount);
  }

  // 収入と支出の合計を計算

  // currentYearBalanceが0より大きい場合、「繰越し」として支出側に追加
  if (currentYearBalance > 0) {
    expenseByCategory.set("繰越し", currentYearBalance);

    // 支出データに「繰越し」レコードを追加（UI用）
    processedAggregation.expense.push({
      category: "繰越し",
      totalAmount: currentYearBalance,
    });
  }

  // 未払費用が0より大きい場合、「繰越し」として支出側に追加
  if (unrealizedExpensesTotal > 0) {
    const existingCarryover = expenseByCategory.get("繰越し") || 0;
    expenseByCategory.set(
      "繰越し",
      existingCarryover + unrealizedExpensesTotal,
    );

    // 既存の繰越しレコードを更新または新規追加
    const existingCarryoverRecord = processedAggregation.expense.find(
      (item) => item.category === "繰越し",
    );
    if (existingCarryoverRecord) {
      existingCarryoverRecord.totalAmount += unrealizedExpensesTotal;
    } else {
      processedAggregation.expense.push({
        category: "繰越し",
        totalAmount: unrealizedExpensesTotal,
      });
    }
  }

  const totalIncome = Array.from(incomeByCategory.values()).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const totalExpense = Array.from(expenseByCategory.values()).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  // 収入 > 支出の場合、「(仕訳中)」を追加
  if (totalIncome > totalExpense) {
    const currentBalance = totalIncome - totalExpense;
    expenseByCategory.set("(仕訳中)", currentBalance);

    // 支出データに「(仕訳中)」レコードを追加（UI用）
    processedAggregation.expense.push({
      category: "(仕訳中)",
      totalAmount: currentBalance,
    });
  }

  for (const category of expenseByCategory.keys()) {
    const nodeId = createSafariCompatibleId(`expense-${category}`);
    if (!nodeIds.has(nodeId)) {
      nodes.push({
        id: nodeId,
        label: category,
        nodeType: "expense",
      });
      nodeIds.add(nodeId);
    }
  }

  // 5. 支出サブカテゴリノード（subcategoryがあるもの）
  for (const item of processedAggregation.expense) {
    if (item.subcategory) {
      const nodeId = createSafariCompatibleId(
        `expense-sub-${item.subcategory}`,
      );
      if (!nodeIds.has(nodeId)) {
        nodes.push({
          id: nodeId,
          label: item.subcategory,
          nodeType: "expense-sub",
        });
        nodeIds.add(nodeId);
      }
    }
  }

  // リンクの生成

  // 1. 収入サブカテゴリ → 収入カテゴリ（subcategoryがあるもの）
  for (const item of processedAggregation.income) {
    if (item.subcategory) {
      links.push({
        source: createSafariCompatibleId(`income-sub-${item.subcategory}`),
        target: createSafariCompatibleId(`income-${item.category}`),
        value: item.totalAmount,
      });
    }
  }

  // 2. 収入カテゴリ → 合計
  for (const [category, amount] of incomeByCategory) {
    links.push({
      source: createSafariCompatibleId(`income-${category}`),
      target: createSafariCompatibleId("合計"),
      value: amount,
    });
  }

  // 3. 合計 → 支出カテゴリ
  for (const [category, amount] of expenseByCategory) {
    links.push({
      source: createSafariCompatibleId("合計"),
      target: createSafariCompatibleId(`expense-${category}`),
      value: amount,
    });
  }

  // 4. 支出カテゴリ → 支出サブカテゴリ（subcategoryがあるもの）
  for (const item of processedAggregation.expense) {
    if (item.subcategory) {
      links.push({
        source: createSafariCompatibleId(`expense-${item.category}`),
        target: createSafariCompatibleId(`expense-sub-${item.subcategory}`),
        value: item.totalAmount,
      });
    }
  }

  return { nodes, links };
}
