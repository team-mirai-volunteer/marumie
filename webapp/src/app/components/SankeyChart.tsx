"use client";
import "client-only";

import { ResponsiveSankey } from "@nivo/sankey";
import type { SankeyData } from "@/types/sankey";

interface SankeyChartProps {
  data: SankeyData;
}

export default function SankeyChart({ data }: SankeyChartProps) {
  // カスタム色設定関数
  const getNodeColor = (node: { id: string }) => {
    if (node.id === "合計") {
      return "#4F566B"; // 中央のbox
    }

    // 収入関連のカテゴリとサブカテゴリを定義
    const incomeCategories = new Set([
      "寄付",
      "機関紙誌+その他事業収入",
      "借入金",
      "交付金",
      "その他",
    ]);

    const incomeSubcategories = new Set([
      "個人からの寄付",
      "法人その他の団体からの寄附",
      "政治団体からの寄附",
      "政党匿名寄付",
      "党費・会費",
    ]);

    // ノードIDが収入カテゴリまたはサブカテゴリに含まれるかチェック
    if (incomeCategories.has(node.id) || incomeSubcategories.has(node.id)) {
      return "#2AA693"; // 収入のbox
    }

    // それ以外は支出とみなす
    return "#EF4444"; // 支出のbox
  };

  return (
    <div style={{ height: 600 }} className="sankey-container">
      <style jsx global>{`
        .sankey-container svg path {
          fill: #d1d5db !important;
          opacity: 0.8 !important;
        }
        .sankey-container svg path:hover {
          opacity: 0.9 !important;
        }
      `}</style>
      <ResponsiveSankey
        data={data}
        margin={{ top: 40, right: 160, bottom: 40, left: 160 }}
        align="justify"
        colors={getNodeColor}
        valueFormat={(v) =>
          `¥${Math.round(v as number).toLocaleString("ja-JP")}`
        }
        nodeOpacity={1}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        nodeThickness={24}
        nodeSpacing={16}
        linkOpacity={0.5}
        linkHoverOpacity={0.8}
        enableLinkGradient={false}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
      />
    </div>
  );
}
