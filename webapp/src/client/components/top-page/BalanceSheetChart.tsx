"use client";

import type { BalanceSheetData } from "@/types/balance-sheet";
import { BALANCE_SHEET_LABELS } from "@/types/balance-sheet";

interface BalanceSheetChartProps {
  data: BalanceSheetData;
}

// レイアウト定数
const CHART_WIDTH = 500;
const CHART_HEIGHT = 380;
const MARGIN = 1;
const LABEL_HEIGHT = 20;

interface BalanceSheetNode {
  name: string;
  value: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function BalanceSheetChart({ data }: BalanceSheetChartProps) {
  // 座標計算によるレイアウト
  const calculateLayout = (
    balanceSheet: BalanceSheetData,
  ): BalanceSheetNode[] => {
    const nodes: BalanceSheetNode[] = [];

    // 左側（資産）の合計値
    const leftTotal =
      balanceSheet.left.currentAssets +
      balanceSheet.left.fixedAssets +
      balanceSheet.left.debtExcess;
    // 右側（負債・資本）の合計値
    const rightTotal =
      balanceSheet.right.currentLiabilities +
      balanceSheet.right.fixedLiabilities +
      balanceSheet.right.netAssets;

    // 左側の幅を計算（全体幅の比率）
    const totalValue = leftTotal + rightTotal;
    const leftWidth = (CHART_WIDTH * leftTotal) / totalValue;
    const rightWidth = CHART_WIDTH - leftWidth;

    let currentY = 0;

    // 左側（資産）のノードを配置
    if (balanceSheet.left.currentAssets > 0) {
      const height =
        (CHART_HEIGHT * balanceSheet.left.currentAssets) / leftTotal;
      nodes.push({
        name: BALANCE_SHEET_LABELS.currentAssets,
        value: balanceSheet.left.currentAssets,
        color: "#99F6E4",
        x: 0,
        y: currentY,
        width: leftWidth - MARGIN / 2,
        height: height - MARGIN,
      });
      currentY += height;
    }

    if (balanceSheet.left.fixedAssets > 0) {
      const height = (CHART_HEIGHT * balanceSheet.left.fixedAssets) / leftTotal;
      nodes.push({
        name: BALANCE_SHEET_LABELS.fixedAssets,
        value: balanceSheet.left.fixedAssets,
        color: "#2DD4BF",
        x: 0,
        y: currentY,
        width: leftWidth - MARGIN / 2,
        height: height - MARGIN,
      });
      currentY += height;
    }

    if (balanceSheet.left.debtExcess > 0) {
      const height = (CHART_HEIGHT * balanceSheet.left.debtExcess) / leftTotal;
      nodes.push({
        name: BALANCE_SHEET_LABELS.debtExcess,
        value: balanceSheet.left.debtExcess,
        color: "#DC2626",
        x: 0,
        y: currentY,
        width: leftWidth - MARGIN / 2,
        height: height - MARGIN,
      });
    }

    // 右側（負債・資本）のノードを配置
    currentY = 0;

    if (balanceSheet.right.currentLiabilities > 0) {
      const height =
        (CHART_HEIGHT * balanceSheet.right.currentLiabilities) / rightTotal;
      nodes.push({
        name: BALANCE_SHEET_LABELS.currentLiabilities,
        value: balanceSheet.right.currentLiabilities,
        color: "#FECACA",
        x: leftWidth + MARGIN / 2,
        y: currentY,
        width: rightWidth - MARGIN / 2,
        height: height - MARGIN,
      });
      currentY += height;
    }

    if (balanceSheet.right.fixedLiabilities > 0) {
      const height =
        (CHART_HEIGHT * balanceSheet.right.fixedLiabilities) / rightTotal;
      nodes.push({
        name: BALANCE_SHEET_LABELS.fixedLiabilities,
        value: balanceSheet.right.fixedLiabilities,
        color: "#F87171",
        x: leftWidth + MARGIN / 2,
        y: currentY,
        width: rightWidth - MARGIN / 2,
        height: height - MARGIN,
      });
      currentY += height;
    }

    if (balanceSheet.right.netAssets > 0) {
      const height = (CHART_HEIGHT * balanceSheet.right.netAssets) / rightTotal;
      nodes.push({
        name: BALANCE_SHEET_LABELS.netAssets,
        value: balanceSheet.right.netAssets,
        color: "#22D3EE",
        x: leftWidth + MARGIN / 2,
        y: currentY,
        width: rightWidth - MARGIN / 2,
        height: height - MARGIN,
      });
    }

    return nodes;
  };

  const nodes = calculateLayout(data);

  // 金額フォーマット関数
  const formatAmount = (amount: number) => {
    if (amount >= 100000000) {
      const oku = Math.floor(amount / 100000000);
      const man = Math.floor((amount % 100000000) / 10000);
      return man > 0 ? `${oku}億${man}万円` : `${oku}億円`;
    } else if (amount >= 10000) {
      const man = Math.floor(amount / 10000);
      const en = amount % 10000;
      return en > 0 ? `${man}万${en}円` : `${man}万円`;
    }
    return `${amount}円`;
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="relative">
        <svg
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          className="border border-gray-200"
        >
          {nodes.map((node) => (
            <g key={node.name}>
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                fill={node.color}
                stroke="#ffffff"
                strokeWidth={2}
                className="cursor-pointer"
              />
              {/* ラベル */}
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2 - 5}
                textAnchor="middle"
                className="text-sm font-bold fill-black pointer-events-none"
              >
                {node.name}
              </text>
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2 + 15}
                textAnchor="middle"
                className="text-xs font-medium fill-black pointer-events-none"
              >
                {formatAmount(node.value)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
