"use client";
import "client-only";

import { ResponsiveSankey } from "@nivo/sankey";
import type { SankeyData } from "@/types/sankey";

interface SankeyNode {
  id: string;
  label?: string;
  value?: number;
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

// カスタムラベルレイヤー（プライマリ + セカンダリ）
const CustomLabelsLayer = ({ nodes }: { nodes: readonly SankeyNode[] }) => {
  const maxCharsPerLine = 5;

  // 全体の合計値を計算（合計ノードの値を使用）
  const totalValue = nodes.find((node) => node.id === "合計")?.value || 0;

  return (
    <g>
      {nodes.map((node: SankeyNode) => {
        const label = node.id; // HACK: 表示にはnode.idを使用（本来はnode.labelを使うべき）
        // ラベルで収入・支出を判定
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

        // セカンダリラベル（パーセンテージ）の位置と色
        const percentageY = node.y - 5; // ノードの上

        // パーセンテージを計算
        let percentageText = "";
        if (node.value && totalValue > 0) {
          const percentage = (node.value / totalValue) * 100;
          if (percentage < 1) {
            percentageText = ">1%";
          } else {
            percentageText = `${Math.round(percentage)}%`;
          }
        }

        // ボックスと同じ色を取得
        let boxColor = "#EF4444"; // デフォルトは赤
        if (node.id === "合計") {
          boxColor = "#4F566B"; // グレー
        } else if (node.label?.startsWith("income-")) {
          boxColor = "#2AA693"; // 緑
        } else if (node.label?.startsWith("expense-")) {
          boxColor = "#EF4444"; // 赤
        } else if (
          node.id === "寄付" ||
          node.id === "個人からの寄付" ||
          node.id === "その他"
        ) {
          boxColor = "#2AA693"; // 緑
        }

        const elements = [];

        // セカンダリラベル（パーセンテージ）- 値がある場合のみ表示
        if (node.id === "合計") {
          // 合計ノードの特別処理
          // 上のラベル：「収入支出\n100%」
          elements.push(
            <text
              key={`${node.id}-top`}
              x={node.x + node.width / 2}
              y={percentageY - 10}
              textAnchor="middle"
              dominantBaseline="bottom"
              fill={boxColor}
              fontSize="8px"
              fontWeight="bold"
            >
              <tspan x={node.x + node.width / 2} dy="0">
                収入支出
              </tspan>
              <tspan x={node.x + node.width / 2} dy="10">
                100%
              </tspan>
            </text>,
          );

          // 下のラベル：金額
          const amountText = node.value
            ? `${Math.round(node.value / 10000).toLocaleString("ja-JP")}万円`
            : "";
          if (amountText) {
            elements.push(
              <text
                key={`${node.id}-bottom`}
                x={node.x + node.width / 2}
                y={node.y + node.height + 15}
                textAnchor="middle"
                dominantBaseline="top"
                fill={boxColor}
                fontSize="8px"
                fontWeight="bold"
              >
                {amountText}
              </text>,
            );
          }
        } else if (percentageText) {
          // 通常のノードのパーセンテージ表示
          elements.push(
            <text
              key={`${node.id}-percentage`}
              x={node.x + node.width / 2}
              y={percentageY}
              textAnchor="middle"
              dominantBaseline="bottom"
              fill={boxColor}
              fontSize="8px"
              fontWeight="bold"
            >
              {percentageText}
            </text>,
          );
        }

        // プライマリラベル（ノード名）- 合計ノードは除外
        if (node.id !== "合計") {
          if (label.length <= maxCharsPerLine) {
            elements.push(
              <text
                key={`${node.id}-primary`}
                x={x}
                y={node.y + node.height / 2}
                textAnchor={textAnchor}
                dominantBaseline="central"
                fill="#1F2937"
                fontSize="8px"
                fontWeight="bold"
              >
                {label}
              </text>,
            );
          } else {
            // 複数行に分割
            const lines = [];
            for (let i = 0; i < label.length; i += maxCharsPerLine) {
              lines.push(label.substring(i, i + maxCharsPerLine));
            }

            elements.push(
              <text
                key={`${node.id}-primary`}
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
              </text>,
            );
          }
        }

        return elements;
      })}
    </g>
  );
};

export default function SankeyChart({ data }: SankeyChartProps) {
  // ノードを金額順にソートする関数
  const sortNodesByValue = (nodes: any[]) => {
    return [...nodes].sort((a, b) => {
      // 合計ノードは中央に配置されるので除外
      if (a.id === "合計" || b.id === "合計") return 0;

      // 収入・支出の判定
      const isAIncome =
        a.label?.startsWith("income-") ||
        ["寄付", "個人からの寄付", "その他"].includes(a.id);
      const isBIncome =
        b.label?.startsWith("income-") ||
        ["寄付", "個人からの寄付", "その他"].includes(b.id);

      // 同じカテゴリ内でのみソート（金額の多い順）
      if (isAIncome === isBIncome) {
        return (b.value || 0) - (a.value || 0);
      }

      return 0; // 異なるカテゴリはソートしない
    });
  };

  // ソート済みデータを作成
  const sortedData = {
    ...data,
    nodes: sortNodesByValue(data.nodes),
  };

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
        data={sortedData}
        margin={{ top: 12, right: 60, bottom: 0, left: 60 }}
        align="justify"
        colors={getNodeColor}
        valueFormat={(v) =>
          `¥${Math.round(v as number).toLocaleString("ja-JP")}`
        }
        nodeOpacity={1}
        nodeBorderWidth={0}
        nodeThickness={12}
        nodeSpacing={16}
        sort="auto"
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
