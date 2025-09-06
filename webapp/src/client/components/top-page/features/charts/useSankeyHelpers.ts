import React from "react";
import type { SankeyData } from "@/types/sankey";

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
    ): string => {
      // 特別なノードの判定
      if (nodeId?.endsWith("繰越し")) {
        return variant === "light" ? COLORS.CARRYOVER_LIGHT : "#6B7280";
      }

      if (nodeId?.endsWith("処理中")) {
        return variant === "light" ? "#FEE2E2" : "#FCA5A5";
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
