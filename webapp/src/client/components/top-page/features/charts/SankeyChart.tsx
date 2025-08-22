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

// カスタムノードレイヤー（合計ボックスを太くする）
const CustomNodesLayer = ({ nodes }: { nodes: readonly SankeyNode[] }) => {
  return (
    <g>
      {nodes.map((node: SankeyNode) => {
        if (node.id === "合計") {
          // 合計ノードは横幅を倍に、色はグレー（表示用）
          const width = 24; // 元の2倍
          const x = node.x - (width - 12) / 2; // 中央に配置
          return (
            <rect
              key={node.id}
              x={x}
              y={node.y}
              width={width}
              height={node.height}
              fill="#4F566B"
              opacity={1}
            />
          );
        }
        // その他のノードは位置で色分け
        const color = node.x < 150 ? "#2AA693" : "#EF4444"; // 左側は緑、右側は赤
        return (
          <rect
            key={node.id}
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            fill={color}
            opacity={1}
          />
        );
      })}
    </g>
  );
};

// カスタムラベルレイヤー
const CustomLabelsLayer = ({ nodes }: { nodes: readonly SankeyNode[] }) => {
  const maxCharsPerLine = 5;

  return (
    <g>
      {nodes.map((node: SankeyNode) => {
        const label = node.id;
        // 左側の2列（収入側）は左寄せ、右側（支出側）は右寄せ
        const isLeft = node.x < 150; // 閾値を調整して左側2列を判定
        const x = isLeft ? node.x - 5 : node.x + node.width + 5;
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
  // カスタム色設定関数（位置ベース）
  const getNodeColor = (node: { id: string; x?: number }) => {
    if (node.id === "合計") {
      return "#FBE2E7"; // 中央のbox（薄い赤）
    }

    if (
      node.id === "寄付" ||
      node.id === "個人からの寄付" ||
      node.id === "その他"
    ) {
      return "#E5F7F4"; // 寄付・個人からの寄付・その他ノード（薄い緑）
    }

    // 位置で判定：左側（x < 150）は緑、右側は赤
    if (node.x && node.x < 150) {
      return "#E5F7F4"; // 左側のbox（薄い緑）
    } else {
      return "#FBE2E7"; // 右側のbox（薄い赤）
    }
  };

  return (
    <div style={{ height: 300 }} className="sankey-container">
      <style jsx global>{`
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
        layers={["links", CustomNodesLayer, CustomLabelsLayer]}
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
