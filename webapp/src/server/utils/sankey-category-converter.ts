import type { SankeyData, SankeyLink, SankeyNode } from "@/types/sankey";
import type { SankeyCategoryAggregationResult } from "../repositories/interfaces/transaction-repository.interface";
import { createSafariCompatibleId } from "./sankey-id-utils";

const SUBCATEGORY_LIMITS = {
  INCOME: 8,
  EXPENSE: 10,
} as const;

export function convertCategoryAggregationToSankeyData(
  aggregation: SankeyCategoryAggregationResult,
  isFriendlyCategory: boolean = false,
  currentYearBalance: number,
  previousYearBalance: number,
  liabilityBalance: number = 0,
): SankeyData {
  const renamedAggregation = renameOtherCategories(aggregation);

  let processedAggregation = consolidateSmallItems(
    renamedAggregation,
    isFriendlyCategory,
  );

  processedAggregation = adjustBalanceAndCategories(
    processedAggregation,
    isFriendlyCategory,
    currentYearBalance,
    previousYearBalance,
    liabilityBalance,
  );

  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  const nodeIds = new Set<string>();

  const incomeByCategory = new Map<string, number>();

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

    const current = incomeByCategory.get(item.category) || 0;
    incomeByCategory.set(item.category, current + item.totalAmount);
  }

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

  nodes.push({
    id: createSafariCompatibleId("合計"),
    label: "合計",
    nodeType: "total",
  });

  const expenseByCategory = new Map<string, number>();

  for (const item of processedAggregation.expense) {
    const current = expenseByCategory.get(item.category) || 0;
    expenseByCategory.set(item.category, current + item.totalAmount);
  }

  const totalIncome = Array.from(incomeByCategory.values()).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const totalExpense = Array.from(expenseByCategory.values()).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  if (totalIncome > totalExpense) {
    const currentBalance = totalIncome - totalExpense;
    expenseByCategory.set("(仕訳中)", currentBalance);

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

  for (const item of processedAggregation.income) {
    if (item.subcategory) {
      links.push({
        source: createSafariCompatibleId(`income-sub-${item.subcategory}`),
        target: createSafariCompatibleId(`income-${item.category}`),
        value: item.totalAmount,
      });
    }
  }

  for (const [category, amount] of incomeByCategory) {
    links.push({
      source: createSafariCompatibleId(`income-${category}`),
      target: createSafariCompatibleId("合計"),
      value: amount,
    });
  }

  for (const [category, amount] of expenseByCategory) {
    links.push({
      source: createSafariCompatibleId("合計"),
      target: createSafariCompatibleId(`expense-${category}`),
      value: amount,
    });
  }

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

function consolidateSmallItems(
  aggregation: SankeyCategoryAggregationResult,
  isFriendlyCategory: boolean = false,
): SankeyCategoryAggregationResult {
  if (!isFriendlyCategory) {
    return aggregation;
  }

  const incomeThreshold = calculateDynamicThreshold(
    aggregation.income,
    SUBCATEGORY_LIMITS.INCOME,
  );
  const expenseThreshold = calculateDynamicThreshold(
    aggregation.expense,
    SUBCATEGORY_LIMITS.EXPENSE,
  );

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

  for (const [category, total] of smallIncomeByCategory) {
    if (total > 0) {
      consolidatedIncome.push({
        category,
        subcategory: `その他(${category})`,
        totalAmount: total,
      });
    }
  }

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

function calculateDynamicThreshold(
  items: Array<{ subcategory?: string; totalAmount: number }>,
  targetCount: number,
): number {
  const subcategoryItems = items.filter((item) => item.subcategory);

  if (subcategoryItems.length <= targetCount) {
    return 0;
  }

  const sortedItems = [...subcategoryItems].sort(
    (a, b) => b.totalAmount - a.totalAmount,
  );

  const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);
  const onePercentThreshold = totalAmount * 0.01;

  const dynamicThreshold = sortedItems[targetCount - 1].totalAmount;

  return Math.max(dynamicThreshold, onePercentThreshold);
}

function adjustBalanceAndCategories(
  aggregation: SankeyCategoryAggregationResult,
  isFriendlyCategory: boolean,
  currentYearBalance: number,
  previousYearBalance: number,
  liabilityBalance: number = 0,
): SankeyCategoryAggregationResult {
  const result = {
    income: [...aggregation.income],
    expense: [...aggregation.expense],
  };

  if (previousYearBalance > 0) {
    result.income.push({
      category: "昨年からの現金残高",
      totalAmount: previousYearBalance,
    });
  }

  if (currentYearBalance > 0 && !isFriendlyCategory) {
    result.expense.push({
      category: "現金残高",
      totalAmount: currentYearBalance,
    });
  }

  if (currentYearBalance > 0 && isFriendlyCategory) {
    const unpaidAmount = Math.max(liabilityBalance, 0);
    const actualCashBalance = Math.max(currentYearBalance, 0);
    const balanceAmount = Math.max(0, actualCashBalance - unpaidAmount);

    if (unpaidAmount > 0) {
      result.expense.push({
        category: "現金残高",
        subcategory: "未払費用",
        totalAmount: unpaidAmount,
      });
    }

    if (balanceAmount > 0) {
      result.expense.push({
        category: "現金残高",
        subcategory: "収支",
        totalAmount: balanceAmount,
      });
    }
  }

  return result;
}
