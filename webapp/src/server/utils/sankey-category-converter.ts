import type { SankeyData, SankeyNode, SankeyLink } from "@/types/sankey";
import type { SankeyCategoryAggregationResult } from "../repositories/interfaces/transaction-repository.interface";

/**
 * category集計データを5層サンキーデータに変換
 * subcategoryがあるものは5層、ないものは3層になる
 */
export function convertCategoryAggregationToSankeyData(
  aggregation: SankeyCategoryAggregationResult,
): SankeyData {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  // ノードIDの重複を避けるためのSet
  const nodeIds = new Set<string>();

  // 収入データの処理: subcategoryがあるものとないものを分別
  const incomeByCategory = new Map<string, number>();

  // 1. 収入サブカテゴリノード（subcategoryがあるもの）
  for (const item of aggregation.income) {
    if (item.subcategory) {
      if (!nodeIds.has(item.subcategory)) {
        nodes.push({
          id: item.subcategory,
          label: item.subcategory,
        });
        nodeIds.add(item.subcategory);
      }
    }

    // カテゴリ別の合計を計算
    const current = incomeByCategory.get(item.category) || 0;
    incomeByCategory.set(item.category, current + item.totalAmount);
  }

  // 2. 収入カテゴリノード
  for (const category of incomeByCategory.keys()) {
    if (!nodeIds.has(category)) {
      nodes.push({
        id: category,
        label: category,
      });
      nodeIds.add(category);
    }
  }

  // 3. 中央の合計ノード
  nodes.push({
    id: "合計",
    label: "合計",
  });

  // 支出データの処理
  const expenseByCategory = new Map<string, number>();

  // 4. 支出カテゴリノード
  for (const item of aggregation.expense) {
    // カテゴリ別の合計を計算
    const current = expenseByCategory.get(item.category) || 0;
    expenseByCategory.set(item.category, current + item.totalAmount);
  }

  for (const category of expenseByCategory.keys()) {
    if (!nodeIds.has(category)) {
      nodes.push({
        id: category,
        label: category,
      });
      nodeIds.add(category);
    }
  }

  // 5. 支出サブカテゴリノード（subcategoryがあるもの）
  for (const item of aggregation.expense) {
    if (item.subcategory) {
      if (!nodeIds.has(item.subcategory)) {
        nodes.push({
          id: item.subcategory,
          label: item.subcategory,
        });
        nodeIds.add(item.subcategory);
      }
    }
  }

  // リンクの生成

  // 1. 収入サブカテゴリ → 収入カテゴリ（subcategoryがあるもの）
  for (const item of aggregation.income) {
    if (item.subcategory) {
      links.push({
        source: item.subcategory,
        target: item.category,
        value: item.totalAmount,
      });
    }
  }

  // 2. 収入カテゴリ → 合計
  for (const [category, amount] of incomeByCategory) {
    links.push({
      source: category,
      target: "合計",
      value: amount,
    });
  }

  // 3. 合計 → 支出カテゴリ
  for (const [category, amount] of expenseByCategory) {
    links.push({
      source: "合計",
      target: category,
      value: amount,
    });
  }

  // 4. 支出カテゴリ → 支出サブカテゴリ（subcategoryがあるもの）
  for (const item of aggregation.expense) {
    if (item.subcategory) {
      links.push({
        source: item.category,
        target: item.subcategory,
        value: item.totalAmount,
      });
    }
  }

  return { nodes, links };
}
