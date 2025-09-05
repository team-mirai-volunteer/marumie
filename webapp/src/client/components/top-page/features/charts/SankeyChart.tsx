"use client";
import "client-only";

import { ResponsiveSankey } from "@nivo/sankey";
import React from "react";
import { createPortal } from "react-dom";
import type { SankeyData } from "@/types/sankey";
import InteractiveRect from "./InteractiveRect";

// 定数定義
const BREAKPOINT = {
  MOBILE: 768,
} as const;

const COLORS = {
  TOTAL: "#4F566B", // グレー
  INCOME: "#2AA693", // 緑（収入）
  EXPENSE: "#EF4444", // 赤（支出）
  TEXT: "#1F2937", // テキスト色
  // リンク色用（薄い色）
  TOTAL_LIGHT: "#FBE2E7", // 薄い赤
  INCOME_LIGHT: "#E5F7F4", // 薄い緑
  EXPENSE_LIGHT: "#FBE2E7", // 薄い赤
} as const;

const DIMENSIONS = {
  // ノード幅
  NODE_BASE_WIDTH: 12,
  TOTAL_WIDTH_DESKTOP: 48,
  TOTAL_WIDTH_MOBILE: 24,
  REGULAR_WIDTH_DESKTOP: 36,
  REGULAR_WIDTH_MOBILE: 18,

  // マージン・オフセット
  LABEL_OFFSET_DESKTOP: 16,
  LABEL_OFFSET_MOBILE: 5,
  PERCENTAGE_OFFSET: 2,
  AMOUNT_LABEL_OFFSET: 15,
  TOTAL_LABEL_TOP_OFFSET_DESKTOP: 18,
  TOTAL_LABEL_TOP_OFFSET_MOBILE: 12,
  LINE_HEIGHT: 12,
  MULTI_LINE_OFFSET: 6,

  // フォントサイズ
  FONT_SIZE_DESKTOP: "14.5px",
  FONT_SIZE_MOBILE: "8px",
  FONT_SIZE_SUB_DESKTOP: "11px",
  FONT_SIZE_SUB_MOBILE: "6px",

  // その他
  TSPAN_DY_DESKTOP: "16",
  TSPAN_DY_MOBILE: "10",
  CHART_HEIGHT_DESKTOP: 650,
  CHART_HEIGHT_MOBILE: 300,
} as const;

const TEXT = {
  MAX_CHARS_PER_LINE: 7,
  TOTAL_NODE_ID: "合計",
  TOTAL_LABEL_TOP: "収入支出",
  TOTAL_LABEL_PERCENTAGE: "100%",
  PERCENTAGE_THRESHOLD: 1,
  PERCENTAGE_UNDER_ONE: "<1%",
  CURRENCY_DIVIDER: 10000,
  CURRENCY_UNIT: "万円",
} as const;

const CHART_CONFIG = {
  MARGIN_TOP_DESKTOP: 40,
  MARGIN_TOP_MOBILE: 20,
  MARGIN_HORIZONTAL_DESKTOP: 100,
  MARGIN_HORIZONTAL_MOBILE: 40,
  MARGIN_BOTTOM: 30,
  NODE_THICKNESS: 12,
  NODE_SPACING_DESKTOP: 24,
  NODE_SPACING_MOBILE: 12,
  LINK_OPACITY: 0.5,
  LINK_HOVER_OPACITY: 0.8,
  HOVER_OPACITY: 0.9,
} as const;

interface SankeyNodeWithPosition {
  id: string;
  label?: string;
  nodeType?: string;
  value?: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SankeyChartProps {
  data: SankeyData;
}

const getNodeWidth = (nodeType: string | undefined, isMobile: boolean) => {
  if (nodeType === "total") {
    return !isMobile
      ? DIMENSIONS.TOTAL_WIDTH_DESKTOP
      : DIMENSIONS.TOTAL_WIDTH_MOBILE;
  }
  return !isMobile
    ? DIMENSIONS.REGULAR_WIDTH_DESKTOP
    : DIMENSIONS.REGULAR_WIDTH_MOBILE;
};

const getNodeFillColor = (nodeType: string | undefined) => {
  if (nodeType === "total") {
    return COLORS.TOTAL;
  }
  if (nodeType === "income" || nodeType === "income-sub") {
    return COLORS.INCOME;
  }
  return COLORS.EXPENSE;
};

// カスタムノードレイヤー（合計ボックスを太くする）
const CustomNodesLayer = ({
  nodes,
}: {
  nodes: readonly SankeyNodeWithPosition[];
}) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [tooltip, setTooltip] = React.useState<{
    visible: boolean;
    x: number;
    y: number;
    node: SankeyNodeWithPosition | null;
  }>({ visible: false, x: 0, y: 0, node: null });

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINT.MOBILE);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = (
    event: React.MouseEvent,
    nodeData: { id: string; label?: string; value?: number },
  ) => {
    // 元のnode情報を再構築（必要な場合）
    const originalNode = nodes.find((n) => n.id === nodeData.id);

    // 支出側（expense, expense-sub）かどうかを判定
    const isExpenseSide =
      originalNode?.nodeType === "expense" ||
      originalNode?.nodeType === "expense-sub";

    setTooltip({
      visible: true,
      // 支出側の場合は左側に、その他は右側に表示
      x: isExpenseSide ? event.pageX - 10 : event.pageX + 10,
      y: event.pageY - 10,
      node:
        originalNode ||
        ({
          id: nodeData.id,
          label: nodeData.label,
          value: nodeData.value,
        } as SankeyNodeWithPosition),
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip.visible && tooltip.node) {
      // 支出側（expense, expense-sub）かどうかを判定
      const isExpenseSide =
        tooltip.node.nodeType === "expense" ||
        tooltip.node.nodeType === "expense-sub";

      setTooltip((prev) => ({
        ...prev,
        // 支出側の場合は左側に、その他は右側に表示
        x: isExpenseSide ? event.pageX - 10 : event.pageX + 10,
        y: event.pageY - 10,
      }));
    }
  };

  return (
    <>
      <g>
        {nodes.map((node: SankeyNodeWithPosition) => {
          const width = getNodeWidth(node.nodeType, isMobile);
          const x = node.x - (width - DIMENSIONS.NODE_BASE_WIDTH) / 2;
          const color = getNodeFillColor(node.nodeType);

          return (
            <InteractiveRect
              key={node.id}
              id={node.id}
              label={node.label}
              x={x}
              y={node.y}
              width={width}
              height={node.height}
              fill={color}
              value={node.value}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            />
          );
        })}
      </g>
      {tooltip.visible &&
        tooltip.node &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y,
              background: "rgba(255, 255, 255, 0.85)",
              padding: "11px 16px",
              border: "1px solid #64748B",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "700",
              fontFamily: "'Noto Sans JP', sans-serif",
              lineHeight: "1.31",
              color: "#4B5563",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              zIndex: 30, // headerのz-40(4000)より低く設定
              pointerEvents: "none",
              minWidth: "max-content",
              // 支出側の場合は右側を基準に配置
              transform:
                tooltip.node?.nodeType === "expense" ||
                tooltip.node?.nodeType === "expense-sub"
                  ? "translateX(-100%)"
                  : "none",
            }}
          >
            <div style={{ marginBottom: "3px", fontWeight: "700" }}>
              {tooltip.node.label || tooltip.node.id}
            </div>
            <div
              style={{ fontSize: "14px", fontWeight: "700", color: "#1E293B" }}
            >
              ¥{Math.round(tooltip.node.value || 0).toLocaleString("ja-JP")}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

// カスタムラベルレイヤー（プライマリ + セカンダリ）
const calculatePercentageText = (nodeValue?: number, totalValue?: number) => {
  if (!nodeValue || !totalValue || totalValue === 0) {
    return "";
  }

  const percentage = (nodeValue / totalValue) * 100;
  return percentage < TEXT.PERCENTAGE_THRESHOLD
    ? TEXT.PERCENTAGE_UNDER_ONE
    : `${Math.round(percentage)}%`;
};

const getBoxColor = (nodeType?: string) => {
  if (nodeType === "total") {
    return COLORS.TOTAL;
  }
  if (nodeType === "income" || nodeType === "income-sub") {
    return COLORS.INCOME;
  }
  return COLORS.EXPENSE;
};

const renderTotalNodeLabels = (
  node: SankeyNodeWithPosition,
  boxColor: string,
  percentageY: number,
  isMobile: boolean,
) => {
  const elements = [];

  // 上のラベル：「収入支出\n100%」
  elements.push(
    <text
      key={`${node.id}-top`}
      x={node.x + node.width / 2}
      y={
        percentageY -
        (!isMobile
          ? DIMENSIONS.TOTAL_LABEL_TOP_OFFSET_DESKTOP
          : DIMENSIONS.TOTAL_LABEL_TOP_OFFSET_MOBILE)
      }
      textAnchor="middle"
      dominantBaseline="text-after-edge"
      fill={boxColor}
      fontSize={!isMobile ? "14.5px" : "8px"}
      fontWeight="bold"
    >
      <tspan x={node.x + node.width / 2} dy="0">
        {TEXT.TOTAL_LABEL_TOP}
      </tspan>
      <tspan
        x={node.x + node.width / 2}
        dy={
          !isMobile ? DIMENSIONS.TSPAN_DY_DESKTOP : DIMENSIONS.TSPAN_DY_MOBILE
        }
      >
        {TEXT.TOTAL_LABEL_PERCENTAGE}
      </tspan>
    </text>,
  );

  // 下のラベル：金額
  const amountText = node.value
    ? `${Math.round(node.value / TEXT.CURRENCY_DIVIDER).toLocaleString("ja-JP")}${TEXT.CURRENCY_UNIT}`
    : "";
  if (amountText) {
    elements.push(
      <text
        key={`${node.id}-bottom`}
        x={node.x + node.width / 2}
        y={node.y + node.height + DIMENSIONS.AMOUNT_LABEL_OFFSET}
        textAnchor="middle"
        dominantBaseline="text-before-edge"
        fill={boxColor}
        fontSize={!isMobile ? "14.5px" : "8px"}
        fontWeight="bold"
      >
        {amountText}
      </text>,
    );
  }

  return elements;
};

const renderPercentageLabel = (
  node: SankeyNodeWithPosition,
  percentageText: string,
  boxColor: string,
  percentageY: number,
  isMobile: boolean,
) => {
  if (!percentageText) {
    return null;
  }

  return (
    <text
      key={`${node.id}-percentage`}
      x={node.x + node.width / 2}
      y={percentageY}
      textAnchor="middle"
      dominantBaseline="text-after-edge"
      fill={boxColor}
      fontSize={!isMobile ? "14.5px" : "8px"}
      fontWeight="bold"
    >
      {percentageText}
    </text>
  );
};

const renderPrimaryLabel = (
  node: SankeyNodeWithPosition,
  x: number,
  textAnchor: "start" | "middle" | "end" | "inherit",
  isMobile: boolean,
) => {
  const label = node.label || node.id; // 表示にはnode.labelを使用、fallbackでnode.idを使用

  // サブカテゴリ判定
  const isSubcategory =
    node.nodeType === "income-sub" || node.nodeType === "expense-sub";

  const fontSize = !isMobile
    ? isSubcategory
      ? DIMENSIONS.FONT_SIZE_SUB_DESKTOP
      : DIMENSIONS.FONT_SIZE_DESKTOP
    : isSubcategory
      ? DIMENSIONS.FONT_SIZE_SUB_MOBILE
      : DIMENSIONS.FONT_SIZE_MOBILE;

  if (label.length <= TEXT.MAX_CHARS_PER_LINE) {
    return (
      <text
        key={`${node.id}-primary`}
        x={x}
        y={node.y + node.height / 2}
        textAnchor={textAnchor as "start" | "middle" | "end"}
        dominantBaseline="middle"
        fill={COLORS.TEXT}
        fontSize={fontSize}
        fontWeight="bold"
      >
        {label}
      </text>
    );
  }

  // 複数行に分割
  const lines = [];
  for (let i = 0; i < label.length; i += TEXT.MAX_CHARS_PER_LINE) {
    lines.push(label.substring(i, i + TEXT.MAX_CHARS_PER_LINE));
  }

  return (
    <text
      key={`${node.id}-primary`}
      x={x}
      y={
        node.y +
        node.height / 2 -
        (lines.length - 1) * DIMENSIONS.MULTI_LINE_OFFSET
      }
      textAnchor={textAnchor}
      fill={COLORS.TEXT}
      fontSize={fontSize}
      fontWeight="bold"
    >
      {lines.map((line, index) => (
        <tspan
          key={`${node.id}-${index}`}
          x={x}
          dy={index === 0 ? 0 : DIMENSIONS.LINE_HEIGHT}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
};

// カスタムラベルレイヤー（プライマリ + セカンダリ）
const CustomLabelsLayer = ({
  nodes,
}: {
  nodes: readonly SankeyNodeWithPosition[];
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINT.MOBILE);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 全体の合計値を計算（合計ノードの値を使用）
  const totalValue =
    nodes.find((node) => node.id === TEXT.TOTAL_NODE_ID)?.value || 0;

  return (
    <g>
      {nodes.map((node: SankeyNodeWithPosition) => {
        // ノードタイプで収入・支出を判定
        const isLeft =
          node.nodeType === "income" || node.nodeType === "income-sub";
        const x = isLeft
          ? node.x -
            (!isMobile
              ? DIMENSIONS.LABEL_OFFSET_DESKTOP
              : DIMENSIONS.LABEL_OFFSET_MOBILE)
          : node.x +
            node.width +
            (!isMobile
              ? DIMENSIONS.LABEL_OFFSET_DESKTOP
              : DIMENSIONS.LABEL_OFFSET_MOBILE);
        const textAnchor = isLeft ? "end" : "start";
        const percentageY = node.y - DIMENSIONS.PERCENTAGE_OFFSET;
        const percentageText = calculatePercentageText(node.value, totalValue);
        const boxColor = getBoxColor(node.nodeType);
        const elements = [];

        if (node.nodeType === "total") {
          elements.push(
            ...renderTotalNodeLabels(node, boxColor, percentageY, isMobile),
          );
        } else if (percentageText) {
          const percentageLabel = renderPercentageLabel(
            node,
            percentageText,
            boxColor,
            percentageY,
            isMobile,
          );
          if (percentageLabel) {
            elements.push(percentageLabel);
          }
        }

        if (node.nodeType !== "total") {
          elements.push(renderPrimaryLabel(node, x, textAnchor, isMobile));
        }

        return elements;
      })}
    </g>
  );
};

export default function SankeyChart({ data }: SankeyChartProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINT.MOBILE);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  // ノードの金額を計算する関数（リンクから合計値を算出）
  const calculateNodeValue = (
    nodeId: string,
    links: { source: string; target: string; value: number }[],
  ) => {
    const incomingLinks = links.filter((link) => link.target === nodeId);
    const outgoingLinks = links.filter((link) => link.source === nodeId);

    // 入力リンクがある場合はその合計、なければ出力リンクの合計
    const totalValue =
      incomingLinks.length > 0
        ? incomingLinks.reduce((sum, link) => sum + (link.value || 0), 0)
        : outgoingLinks.reduce((sum, link) => sum + (link.value || 0), 0);

    return totalValue;
  };

  // ノードを金額順にソートする関数
  const sortNodesByValue = (
    nodes: Array<{ id: string; label?: string; nodeType?: string }>,
  ) => {
    return [...nodes].sort((a, b) => {
      // 合計ノードは中央に配置されるので除外
      if (a.id === TEXT.TOTAL_NODE_ID || b.id === TEXT.TOTAL_NODE_ID) {
        return 0;
      }

      // ノードタイプによる優先順位
      const typeOrder = {
        income: 1,
        "income-sub": 2,
        expense: 3,
        "expense-sub": 4,
      } as const;

      const aOrder = typeOrder[a.nodeType as keyof typeof typeOrder] || 99;
      const bOrder = typeOrder[b.nodeType as keyof typeof typeOrder] || 99;

      if (aOrder !== bOrder) {
        return aOrder - bOrder; // タイプ順
      }

      // 「収支」は末尾に配置
      if (a.label === "収支" && b.label !== "収支") {
        return 1; // aを後に
      }
      if (b.label === "収支" && a.label !== "収支") {
        return -1; // bを後に
      }

      // 同じタイプ内では金額の絶対値順（降順）
      const aValue = Math.abs(calculateNodeValue(a.id, data.links));
      const bValue = Math.abs(calculateNodeValue(b.id, data.links));

      return bValue - aValue;
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
  const getNodeColor = (node: { id: string; nodeType?: string }) => {
    if (node.nodeType === "total") {
      return COLORS.TOTAL_LIGHT;
    }

    if (node.nodeType === "income" || node.nodeType === "income-sub") {
      return COLORS.INCOME_LIGHT;
    }

    return COLORS.EXPENSE_LIGHT;
  };

  return (
    <div
      style={{
        height: !isMobile
          ? DIMENSIONS.CHART_HEIGHT_DESKTOP
          : DIMENSIONS.CHART_HEIGHT_MOBILE,
      }}
      className="sankey-container"
      role="img"
      aria-label="政治資金の収支フロー図"
      aria-describedby="sankey-chart-description"
    >
      <div id="sankey-chart-description" className="sr-only">
        政治資金の収入から支出へのお金の流れを示すサンキーダイアグラムです。
      </div>
      <style jsx global>{`
        .sankey-container svg path:hover {
          opacity: ${CHART_CONFIG.HOVER_OPACITY} !important;
        }
        .sankey-container svg text {
          white-space: pre-line;
        }
      `}</style>
      <ResponsiveSankey
        data={sortedData}
        label={(node: { id: string; label?: string }) => {
          return node.label || node.id;
        }}
        margin={{
          top: !isMobile
            ? CHART_CONFIG.MARGIN_TOP_DESKTOP
            : CHART_CONFIG.MARGIN_TOP_MOBILE,
          right: !isMobile
            ? CHART_CONFIG.MARGIN_HORIZONTAL_DESKTOP
            : CHART_CONFIG.MARGIN_HORIZONTAL_MOBILE,
          bottom: CHART_CONFIG.MARGIN_BOTTOM,
          left: !isMobile
            ? CHART_CONFIG.MARGIN_HORIZONTAL_DESKTOP
            : CHART_CONFIG.MARGIN_HORIZONTAL_MOBILE,
        }}
        align="center"
        colors={getNodeColor}
        valueFormat={(v) =>
          `¥${Math.round(v as number).toLocaleString("ja-JP")}`
        }
        nodeOpacity={1}
        nodeBorderWidth={0}
        nodeThickness={CHART_CONFIG.NODE_THICKNESS}
        nodeSpacing={
          !isMobile
            ? CHART_CONFIG.NODE_SPACING_DESKTOP
            : CHART_CONFIG.NODE_SPACING_MOBILE
        }
        sort="auto"
        linkOpacity={CHART_CONFIG.LINK_OPACITY}
        linkHoverOpacity={CHART_CONFIG.LINK_OPACITY}
        enableLinkGradient={false}
        enableLabels={false}
        isInteractive={false}
        layers={["links", CustomNodesLayer, CustomLabelsLayer]}
        theme={{
          labels: {
            text: {
              fontSize: !isMobile
                ? DIMENSIONS.FONT_SIZE_DESKTOP
                : DIMENSIONS.FONT_SIZE_MOBILE,
              fontWeight: "bold",
            },
          },
        }}
      />
    </div>
  );
}
