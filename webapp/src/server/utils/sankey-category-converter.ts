import type { SankeyData, SankeyLink, SankeyNode } from "@/types/sankey";
import type { SankeyCategoryAggregationResult } from "../repositories/interfaces/transaction-repository.interface";

/**
 * 1%以下の小項目をまとめる処理
 */
function consolidateSmallItems(
  aggregation: SankeyCategoryAggregationResult,
  isFriendlyCategory: boolean = false,
): SankeyCategoryAggregationResult {
  if (!isFriendlyCategory) {
    return aggregation;
  }

  // 全体の収入・支出合計を計算
  const totalIncome = aggregation.income.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );
  const totalExpense = aggregation.expense.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  // 1%の閾値
  const incomeThreshold = totalIncome * 0.01;
  const expenseThreshold = totalExpense * 0.01;

  // 収入の処理 - カテゴリ別に1%以下を集計
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

  // カテゴリ別に1%以下の合計項目を追加
  for (const [category, total] of smallIncomeByCategory) {
    if (total > 0) {
      consolidatedIncome.push({
        category,
        subcategory: `1%以下合計（${category}）`,
        totalAmount: total,
      });
    }
  }

  // 支出の処理 - カテゴリ別に1%以下を集計
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

  // カテゴリ別に1%以下の合計項目を追加
  for (const [category, total] of smallExpenseByCategory) {
    if (total > 0) {
      consolidatedExpense.push({
        category,
        subcategory: `1%以下合計（${category}）`,
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

  // 1. 収入サブカテゴリノード（subcategoryがあるもの）
  for (const item of processedAggregation.income) {
    if (item.subcategory) {
      const nodeId = `income-sub-${item.subcategory}`;
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
    const nodeId = `income-${category}`;
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
    id: "合計",
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
  const totalIncome = Array.from(incomeByCategory.values()).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const totalExpense = Array.from(expenseByCategory.values()).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  // 収入 > 支出の場合、「収支」を追加
  if (totalIncome > totalExpense) {
    const currentBalance = totalIncome - totalExpense;
    expenseByCategory.set("収支", currentBalance);

    // 支出データに「収支」レコードを追加（UI用）
    processedAggregation.expense.push({
      category: "収支",
      totalAmount: currentBalance,
    });
  }

  for (const category of expenseByCategory.keys()) {
    const nodeId = `expense-${category}`;
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
      const nodeId = `expense-sub-${item.subcategory}`;
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
        source: `income-sub-${item.subcategory}`,
        target: `income-${item.category}`,
        value: item.totalAmount,
      });
    }
  }

  // 2. 収入カテゴリ → 合計
  for (const [category, amount] of incomeByCategory) {
    links.push({
      source: `income-${category}`,
      target: "合計",
      value: amount,
    });
  }

  // 3. 合計 → 支出カテゴリ
  for (const [category, amount] of expenseByCategory) {
    links.push({
      source: "合計",
      target: `expense-${category}`,
      value: amount,
    });
  }

  // 4. 支出カテゴリ → 支出サブカテゴリ（subcategoryがあるもの）
  for (const item of processedAggregation.expense) {
    if (item.subcategory) {
      links.push({
        source: `expense-${item.category}`,
        target: `expense-sub-${item.subcategory}`,
        value: item.totalAmount,
      });
    }
  }

  return { nodes, links };
}
