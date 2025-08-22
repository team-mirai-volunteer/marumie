"use client";
import "client-only";

import { ResponsiveSankey } from "@nivo/sankey";
import type { SankeyData } from "@/types/sankey";

interface SankeyNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SankeyChartProps {
  data: SankeyData;
}

// カスタムラベルレイヤー
const CustomLabelsLayer = ({ nodes }: { nodes: readonly SankeyNode[] }) => {
  const maxCharsPerLine = 5;

  return (
    <g>
      {nodes.map((node: SankeyNode) => {
        const label = node.id;
        // 左側の2列（収入側）は左寄せ、右側（支出側）は右寄せ
        const isLeft = node.x < 150; // 閾値を調整して左側2列を判定
        const x = isLeft ? node.x - 10 : node.x + node.width + 10;
        const textAnchor = isLeft ? "end" : "start";

        if (label.length <= maxCharsPerLine) {
          return (
            <text
              key={node.id}
              x={x}
              y={node.y + node.height / 2}
              textAnchor={textAnchor}
              dominantBaseline="central"
              fill="#1F2937"
              fontSize="8px"
              fontWeight="bold"
            >
              {label}
            </text>
          );
        }

        // 複数行に分割
        const lines = [];
        for (let i = 0; i < label.length; i += maxCharsPerLine) {
          lines.push(label.substring(i, i + maxCharsPerLine));
        }

        return (
          <text
            key={node.id}
            x={x}
            y={node.y + node.height / 2 - (lines.length - 1) * 6}
            textAnchor={textAnchor}
            fill="#1F2937"
            fontSize="8px"
            fontWeight="bold"
          >
            {lines.map((line, index) => (
              <tspan
                key={`${node.id}-${index}`}
                x={x}
                dy={index === 0 ? 0 : 12}
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </g>
  );
};

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
    <div style={{ height: 300 }} className="sankey-container">
      <style jsx global>{`
        .sankey-container svg path {
          fill: #d1d5db !important;
          opacity: 0.8 !important;
        }
        .sankey-container svg path:hover {
          opacity: 0.9 !important;
        }
        .sankey-container svg text {
          white-space: pre-line;
        }
      `}</style>
      <ResponsiveSankey
        data={data}
        margin={{ top: 0, right: 60, bottom: 0, left: 60 }}
        align="justify"
        colors={getNodeColor}
        valueFormat={(v) =>
          `¥${Math.round(v as number).toLocaleString("ja-JP")}`
        }
        nodeOpacity={1}
        nodeBorderWidth={0}
        nodeThickness={12}
        nodeSpacing={16}
        linkOpacity={0.5}
        linkHoverOpacity={0.8}
        enableLinkGradient={false}
        enableLabels={false}
        layers={["links", "nodes", CustomLabelsLayer]}
        theme={{
          labels: {
            text: {
              fontSize: "8px",
              fontWeight: "bold",
            },
          },
        }}
      />
    </div>
  );
}
