import React from "react";
import type { SankeyData, SankeyLink, SankeyNode } from "@/types/sankey";

const BREAKPOINT = {
  MOBILE: 768,
} as const;

const COLORS = {
  TOTAL: "#4F566B", // グレー
  INCOME: "#2AA693", // 緑（収入）
  EXPENSE: "#DC2626", // 赤（支出）
  TEXT: "#1F2937", // テキスト色
  // リンク色用（薄い色）
  TOTAL_LIGHT: "#FBE2E7", // 薄い赤
  INCOME_LIGHT: "#E5F7F4", // 薄い緑
  EXPENSE_LIGHT: "#FBE2E7", // 薄い赤
  CARRYOVER_LIGHT: "#E5E7EB", // 薄いグレー（繰越し用）
} as const;

// モバイル検知のカスタムフック
export function useMobileDetection() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINT.MOBILE);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

// 色管理のカスタムフック
export function useNodeColors() {
  // 統一されたノード色取得関数
  const getNodeColor = React.useCallback(
    (
      nodeId: string,
      nodeType?: string,
      variant: "fill" | "light" | "box" = "fill",
      nodeLabel?: string,
    ): string => {
      // 特別なノードの判定（labelベース）
      if (nodeLabel === "繰越し") {
        if (variant === "light") return "#D2D4D8";
        if (variant === "box" || variant === "fill") return "#6B7280"; // ボックス色はグレーのまま
        return COLORS.TEXT; // テキスト色は#1F2937
      }

      if (nodeLabel === "昨年からの繰越し") {
        if (variant === "light") return "#D2D4D8";
        if (variant === "box" || variant === "fill") return "#6B7280"; // ボックス色はグレーのまま
        return COLORS.TEXT; // テキスト色は#1F2937
      }

      if (nodeLabel === "(仕訳中)") {
        return variant === "light" ? "#FFF2F2" : "#F87171";
      }

      // 通常のノードタイプ判定
      if (nodeType === "total") {
        return variant === "light" ? COLORS.INCOME_LIGHT : COLORS.TOTAL;
      }

      if (nodeType === "income" || nodeType === "income-sub") {
        return variant === "light" ? COLORS.INCOME_LIGHT : COLORS.INCOME;
      }

      return variant === "light" ? COLORS.EXPENSE_LIGHT : COLORS.EXPENSE;
    },
    [],
  );

  return { getNodeColor };
}

// リンク色処理のカスタムフック
export function useLinkColors(data: SankeyData) {
  const { getNodeColor } = useNodeColors();

  const processLinksWithColors = React.useCallback(() => {
    return data.links.map((link) => {
      const targetNode = data.nodes.find((n) => n.id === link.target);
      const targetColor = getNodeColor(
        link.target,
        targetNode?.nodeType,
        "light",
        targetNode?.label,
      );

      // すべてのリンクの色はターゲットノードの色で統一
      return {
        ...link,
        startColor: targetColor,
        endColor: targetColor,
      };
    });
  }, [data.links, data.nodes, getNodeColor]);

  return { processLinksWithColors };
}

// ソート関連のカスタムフック
export function useSankeySorting(data: SankeyData) {
  // ノードの値を計算する関数
  const calculateNodeValue = React.useCallback(
    (nodeId: string, links: SankeyLink[]) => {
      // 対象ノードに関連するリンクを取得
      const incomingLinks = links.filter((link) => link.target === nodeId);
      const outgoingLinks = links.filter((link) => link.source === nodeId);

      // 入力リンクがある場合はその合計、なければ出力リンクの合計
      const totalValue =
        incomingLinks.length > 0
          ? incomingLinks.reduce((sum, link) => sum + (link.value || 0), 0)
          : outgoingLinks.reduce((sum, link) => sum + (link.value || 0), 0);

      return totalValue;
    },
    [],
  );

  // ① ノードを並び替え
  const sortNodes = React.useCallback(
    (nodes: SankeyNode[]) => {
      return [...nodes].sort((a, b) => {
        // ノードタイプによる基本的な順序
        const typeOrder = {
          "income-sub": 0,
          income: 1,
          total: 2,
          expense: 3,
          "expense-sub": 4,
        } as const;

        const aOrder = typeOrder[a.nodeType as keyof typeof typeOrder] ?? 5;
        const bOrder = typeOrder[b.nodeType as keyof typeof typeOrder] ?? 5;

        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }

        // income, expense -> 単純に大きい順に並び替え
        if (a.nodeType === "income" || a.nodeType === "expense") {
          const aValue = calculateNodeValue(a.id, data.links);
          const bValue = calculateNodeValue(b.id, data.links);

          // income カテゴリでの特別処理
          if (a.nodeType === "income") {
            const aIsPreviousYearCarryover = a.label === "昨年からの繰越し";
            const bIsPreviousYearCarryover = b.label === "昨年からの繰越し";

            // 昨年からの繰越し vs その他
            if (aIsPreviousYearCarryover && !bIsPreviousYearCarryover) return 1; // 昨年からの繰越しを最後に
            if (bIsPreviousYearCarryover && !aIsPreviousYearCarryover)
              return -1; // 昨年からの繰越しを最後に
          }

          // expense カテゴリでの特別処理
          if (a.nodeType === "expense") {
            const aIsCarryover = a.label === "繰越し";
            const bIsCarryover = b.label === "繰越し";
            const aIsProcessing = a.label === "(仕訳中)";
            const bIsProcessing = b.label === "(仕訳中)";

            // 繰越し vs その他
            if (aIsCarryover && !bIsCarryover) return 1; // 繰越しを最後に
            if (bIsCarryover && !aIsCarryover) return -1; // 繰越しを最後に

            // (仕訳中) vs その他（繰越し以外）
            if (aIsProcessing && !bIsProcessing && !bIsCarryover) return 1; // (仕訳中)を後に
            if (bIsProcessing && !aIsProcessing && !aIsCarryover) return -1; // (仕訳中)を後に
          }

          return bValue - aValue; // 大きい順
        }

        // income-sub, expense-sub -> 親カテゴリのサイズ・自カテゴリのサイズで複合ソート
        if (a.nodeType === "income-sub" || a.nodeType === "expense-sub") {
          // 親カテゴリを特定
          const getParentCategory = (nodeId: string, nodeType: string) => {
            if (nodeType === "income-sub") {
              // income-sub-{subcategory} -> income-{category}への接続を探す
              const link = data.links.find(
                (link) =>
                  link.source === nodeId && link.target.startsWith("income-"),
              );
              return link?.target;
            } else if (nodeType === "expense-sub") {
              // expense-{category} -> expense-sub-{subcategory}への接続を探す
              const link = data.links.find(
                (link) =>
                  link.target === nodeId && link.source.startsWith("expense-"),
              );
              return link?.source;
            }
            return null;
          };

          const aParent = getParentCategory(a.id, a.nodeType!);
          const bParent = getParentCategory(b.id, b.nodeType!);

          // 親カテゴリのサイズで比較
          if (aParent && bParent && aParent !== bParent) {
            const aParentValue = calculateNodeValue(aParent, data.links);
            const bParentValue = calculateNodeValue(bParent, data.links);
            if (aParentValue !== bParentValue) {
              return bParentValue - aParentValue; // 大きい親から
            }
          }

          // 同じ親カテゴリなら自カテゴリのサイズで比較
          const aValue = calculateNodeValue(a.id, data.links);
          const bValue = calculateNodeValue(b.id, data.links);
          return bValue - aValue; // 大きい順
        }

        return 0;
      });
    },
    [data.links, calculateNodeValue],
  );

  // ② リンクを並び替え
  const sortLinks = React.useCallback(
    (
      links: Array<{
        source: string;
        target: string;
        value: number;
        startColor: string;
        endColor: string;
      }>,
      nodeOrder: string[],
    ) => {
      return [...links].sort((a, b) => {
        const aSourceIndex = nodeOrder.indexOf(a.source);
        const bSourceIndex = nodeOrder.indexOf(b.source);
        const aTargetIndex = nodeOrder.indexOf(a.target);
        const bTargetIndex = nodeOrder.indexOf(b.target);

        // income側 -> source側のノード順でソート
        const aIsIncomeSide =
          a.source.startsWith("income") ||
          a.target.startsWith("income") ||
          data.nodes.find((n) => n.id === a.target)?.label === "合計";
        const bIsIncomeSide =
          b.source.startsWith("income") ||
          b.target.startsWith("income") ||
          data.nodes.find((n) => n.id === b.target)?.label === "合計";

        if (aIsIncomeSide && bIsIncomeSide) {
          return aSourceIndex - bSourceIndex;
        }

        // expense側 -> target側のノード順でソート
        if (!aIsIncomeSide && !bIsIncomeSide) {
          return aTargetIndex - bTargetIndex;
        }

        // 混在の場合
        return aSourceIndex - bSourceIndex;
      });
    },
    [data.nodes],
  );

  return { sortNodes, sortLinks };
}
