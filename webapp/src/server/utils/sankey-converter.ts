import type { DisplayTransaction } from "@/types/display-transaction";
import type { SankeyData, SankeyNode, SankeyLink } from "@/types/sankey";

export function convertToSankeyData(
  transactions: DisplayTransaction[]
): SankeyData {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  // 収入と支出のデータを分類
  const incomeTransactions = transactions.filter(
    (t) => t.transactionType === "income"
  );
  const expenseTransactions = transactions.filter(
    (t) => t.transactionType === "expense"
  );

  // 収入データの集計
  const incomeByCategory = new Map<string, number>();
  const incomeBySubcategory = new Map<
    string,
    { category: string; amount: number }
  >();

  for (const transaction of incomeTransactions) {
    // カテゴリ別集計
    const categoryAmount = incomeByCategory.get(transaction.category) || 0;
    incomeByCategory.set(
      transaction.category,
      categoryAmount + transaction.absAmount
    );

    // サブカテゴリ別集計
    if (transaction.subcategory) {
      const subKey = `${transaction.category}|${transaction.subcategory}`;
      const existing = incomeBySubcategory.get(subKey);
      if (existing) {
        existing.amount += transaction.absAmount;
      } else {
        incomeBySubcategory.set(subKey, {
          category: transaction.category,
          amount: transaction.absAmount,
        });
      }
    }
  }

  // 支出データの集計
  const expenseByCategory = new Map<string, number>();
  const expenseBySubcategory = new Map<
    string,
    { category: string; amount: number }
  >();

  for (const transaction of expenseTransactions) {
    // カテゴリ別集計
    const categoryAmount = expenseByCategory.get(transaction.category) || 0;
    expenseByCategory.set(
      transaction.category,
      categoryAmount + transaction.absAmount
    );

    // サブカテゴリ別集計
    if (transaction.subcategory) {
      const subKey = `${transaction.category}|${transaction.subcategory}`;
      const existing = expenseBySubcategory.get(subKey);
      if (existing) {
        existing.amount += transaction.absAmount;
      } else {
        expenseBySubcategory.set(subKey, {
          category: transaction.category,
          amount: transaction.absAmount,
        });
      }
    }
  }

  // ノードの生成

  // 1. 収入サブカテゴリノード
  for (const [subKey] of incomeBySubcategory) {
    const [, subcategory] = subKey.split("|");
    nodes.push({
      id: `income-sub-${subcategory}`,
      label: subcategory,
    });
  }

  // 2. 収入カテゴリノード
  for (const category of incomeByCategory.keys()) {
    nodes.push({
      id: `income-cat-${category}`,
      label: category,
    });
  }

  // 3. 中央の合計ノード
  nodes.push({
    id: "total",
    label: "合計",
  });

  // 4. 支出カテゴリノード
  for (const category of expenseByCategory.keys()) {
    nodes.push({
      id: `expense-cat-${category}`,
      label: category,
    });
  }

  // 5. 支出サブカテゴリノード
  for (const [subKey] of expenseBySubcategory) {
    const [, subcategory] = subKey.split("|");
    nodes.push({
      id: `expense-sub-${subcategory}`,
      label: subcategory,
    });
  }

  // リンクの生成

  // 1. 収入サブカテゴリ → 収入カテゴリ
  for (const [subKey, data] of incomeBySubcategory) {
    const [, subcategory] = subKey.split("|");
    links.push({
      source: `income-sub-${subcategory}`,
      target: `income-cat-${data.category}`,
      value: data.amount,
    });
  }

  // 2. 収入カテゴリ → 合計
  for (const [category, amount] of incomeByCategory) {
    links.push({
      source: `income-cat-${category}`,
      target: "total",
      value: amount,
    });
  }

  // 3. 合計 → 支出カテゴリ
  for (const [category, amount] of expenseByCategory) {
    links.push({
      source: "total",
      target: `expense-cat-${category}`,
      value: amount,
    });
  }

  // 4. 支出カテゴリ → 支出サブカテゴリ
  for (const [subKey, data] of expenseBySubcategory) {
    const [, subcategory] = subKey.split("|");
    links.push({
      source: `expense-cat-${data.category}`,
      target: `expense-sub-${subcategory}`,
      value: data.amount,
    });
  }

  return { nodes, links };
}
