"use client";
import "client-only";

import { ResponsiveSankey } from "@nivo/sankey";
import type { SankeyData } from "@/types/sankey";

interface SankeyNode {
  id: string;
  label?: string;
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
        // その他のノードはラベルで色分け
        let color = "#EF4444"; // デフォルトは赤

        if (node.label?.startsWith("income-")) {
          color = "#2AA693"; // 収入ノード（緑）
        } else if (node.label?.startsWith("expense-")) {
          color = "#EF4444"; // 支出ノード（赤）
        } else if (
          node.id === "寄付" ||
          node.id === "個人からの寄付" ||
          node.id === "その他"
        ) {
          color = "#2AA693"; // 従来の緑ノード
        }
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
        const label = node.id; // HACK: 表示にはnode.idを使用（本来はnode.labelを使うべき）
        // ラベルで収入・支出を判定、フォールバックでx座標を使用
        let isLeft = false;
        if (node.label?.startsWith("income-")) {
          isLeft = true;
        } else if (node.label?.startsWith("expense-")) {
          isLeft = false;
        } else if (
          node.id === "寄付" ||
          node.id === "個人からの寄付" ||
          node.id === "その他"
        ) {
          isLeft = true;
        }
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
  // HACK: リンクの色制御のための回避策
  // Nivoはリンクの色をソースノードの色に依存させるため、
  // getNodeColor()では薄い色を返してリンクを薄く表示し、
  // CustomNodesLayerでは濃い色でノードを描画している
  // 理想的にはlabelに接頭辞（income-, expense-）を付けて判定するが、
  // 現在は表示用のidと内部処理用のlabelが逆転している状態
  const getNodeColor = (node: { id: string; label?: string; x?: number }) => {
    if (node.id === "合計") {
      return "#FBE2E7"; // 中央のbox（薄い赤、リンク色用）
    }

    // node.labelに接頭辞がある場合は接頭辞で判定
    if (node.label?.startsWith("income-")) {
      return "#E5F7F4"; // 収入ノード（薄い緑、リンク色用）
    }

    if (node.label?.startsWith("expense-")) {
      return "#FBE2E7"; // 支出ノード（薄い赤、リンク色用）
    }

    // 接頭辞がない場合は従来の判定を維持
    if (
      node.id === "寄付" ||
      node.id === "個人からの寄付" ||
      node.id === "その他"
    ) {
      return "#E5F7F4"; // 寄付・個人からの寄付・その他ノード（薄い緑、リンク色用）
    }

    // デフォルトは薄い赤
    return "#FBE2E7";
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
