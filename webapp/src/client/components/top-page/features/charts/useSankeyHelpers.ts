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
      nodeType?: string,
      variant: "fill" | "light" | "box" = "fill",
      nodeLabel?: string,
    ): string => {
      // 特別なノードの判定（labelベース）
      if (nodeLabel === "現金残高") {
        if (variant === "light") return "#D2D4D8";
        if (variant === "box" || variant === "fill") return "#6B7280"; // ボックス色はグレーのまま
        return COLORS.TEXT; // テキスト色は#1F2937
      }

      if (nodeLabel === "昨年からの現金残高") {
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

  // ヘルパー関数: 親カテゴリIDを取得
  const getParentCategoryId = React.useCallback(
    (nodeId: string, nodeType: string) => {
      if (nodeType === "income-sub") {
        const link = data.links.find(
          (link) => link.source === nodeId && link.target.startsWith("income-"),
        );
        return link?.target;
      } else if (nodeType === "expense-sub") {
        const link = data.links.find(
          (link) =>
            link.target === nodeId && link.source.startsWith("expense-"),
        );
        return link?.source;
      }
      return null;
    },
    [data.links],
  );

  // ソート関数: income カテゴリ
  const sortIncomeNodes = React.useCallback(
    (nodes: SankeyNode[]) => {
      return [...nodes].sort((a, b) => {
        const aValue = calculateNodeValue(a.id, data.links);
        const bValue = calculateNodeValue(b.id, data.links);

        // 昨年からの現金残高を最後に
        const aIsPreviousYearCarryover = a.label === "昨年からの現金残高";
        const bIsPreviousYearCarryover = b.label === "昨年からの現金残高";

        if (aIsPreviousYearCarryover && !bIsPreviousYearCarryover) return 1;
        if (bIsPreviousYearCarryover && !aIsPreviousYearCarryover) return -1;

        return bValue - aValue; // 大きい順
      });
    },
    [data.links, calculateNodeValue],
  );

  // ソート関数: expense カテゴリ
  const sortExpenseNodes = React.useCallback(
    (nodes: SankeyNode[]) => {
      return [...nodes].sort((a, b) => {
        const aValue = calculateNodeValue(a.id, data.links);
        const bValue = calculateNodeValue(b.id, data.links);

        const aIsCarryover = a.label === "現金残高";
        const bIsCarryover = b.label === "現金残高";
        const aIsProcessing = a.label === "(仕訳中)";
        const bIsProcessing = b.label === "(仕訳中)";

        // 現金残高を最後に
        if (aIsCarryover && !bIsCarryover) return 1;
        if (bIsCarryover && !aIsCarryover) return -1;

        // (仕訳中)を後に（現金残高以外）
        if (aIsProcessing && !bIsProcessing && !bIsCarryover) return 1;
        if (bIsProcessing && !aIsProcessing && !aIsCarryover) return -1;

        return bValue - aValue; // 大きい順
      });
    },
    [data.links, calculateNodeValue],
  );

  // ソート関数: sub カテゴリ（income-sub, expense-sub）
  const sortSubNodes = React.useCallback(
    (nodes: SankeyNode[], sortedParentNodes: SankeyNode[]) => {
      return [...nodes].sort((a, b) => {
        const aParent = a.nodeType
          ? getParentCategoryId(a.id, a.nodeType)
          : null;
        const bParent = b.nodeType
          ? getParentCategoryId(b.id, b.nodeType)
          : null;

        // 親カテゴリが異なる場合は親の順序に従う
        if (aParent && bParent && aParent !== bParent) {
          // ソート済み親ノードの順序を使用
          const aParentIndex = sortedParentNodes.findIndex(
            (n) => n.id === aParent,
          );
          const bParentIndex = sortedParentNodes.findIndex(
            (n) => n.id === bParent,
          );

          if (aParentIndex !== -1 && bParentIndex !== -1) {
            return aParentIndex - bParentIndex; // 親の順序に従う
          }
        }

        // 同一親内では金額順
        const aValue = calculateNodeValue(a.id, data.links);
        const bValue = calculateNodeValue(b.id, data.links);
        return bValue - aValue;
      });
    },
    [data.links, calculateNodeValue, getParentCategoryId],
  );

  // ① ノードを並び替え（カテゴリ別にfilter→sort→結合）
  const sortNodes = React.useCallback(
    (nodes: SankeyNode[]) => {
      // 親ノードを先にソート
      const incomeNodes = sortIncomeNodes(
        nodes.filter((n) => n.nodeType === "income"),
      );
      const expenseNodes = sortExpenseNodes(
        nodes.filter((n) => n.nodeType === "expense"),
      );

      // ソート済み親ノードを使ってsubノードをソート
      const incomeSubNodes = sortSubNodes(
        nodes.filter((n) => n.nodeType === "income-sub"),
        incomeNodes,
      );
      const expenseSubNodes = sortSubNodes(
        nodes.filter((n) => n.nodeType === "expense-sub"),
        expenseNodes,
      );

      const totalNode = nodes.find((n) => n.nodeType === "total");

      return [
        ...incomeSubNodes,
        ...incomeNodes,
        ...(totalNode ? [totalNode] : []),
        ...expenseNodes,
        ...expenseSubNodes,
      ];
    },
    [sortSubNodes, sortIncomeNodes, sortExpenseNodes],
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
