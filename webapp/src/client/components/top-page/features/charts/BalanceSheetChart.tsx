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

// 色定数
const COLORS = {
  CURRENT_ASSETS: "#5EEAD4",
  FIXED_ASSETS: "#2DD4BF",
  DEBT_EXCESS: "#DC2626",
  DEBT_EXCESS_STROKE: "#B91C1C",
  CURRENT_LIABILITIES: "#FECACA",
  FIXED_LIABILITIES: "#F87171",
  NET_ASSETS: "#22D3EE",
  WHITE: "#ffffff",
} as const;

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

    // 常に左右の幅を50:50にする
    const leftWidth = CHART_WIDTH / 2;
    const rightWidth = CHART_WIDTH / 2;

    let currentY = 0;

    // 左側（資産）のノードを配置
    if (balanceSheet.left.currentAssets > 0) {
      const height =
        (CHART_HEIGHT * balanceSheet.left.currentAssets) / leftTotal;
      nodes.push({
        name: BALANCE_SHEET_LABELS.currentAssets,
        value: balanceSheet.left.currentAssets,
        color: COLORS.CURRENT_ASSETS,
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
        color: COLORS.FIXED_ASSETS,
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
        color: COLORS.DEBT_EXCESS,
        x: 1,
        y: currentY + 1,
        width: leftWidth - MARGIN / 2 - 2,
        height: height - MARGIN - 2,
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
        color: COLORS.CURRENT_LIABILITIES,
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
        color: COLORS.FIXED_LIABILITIES,
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
        color: COLORS.NET_ASSETS,
        x: leftWidth + MARGIN / 2,
        y: currentY,
        width: rightWidth - MARGIN / 2,
        height: height - MARGIN,
      });
    }

    return nodes;
  };

  const nodes = calculateLayout(data);

  // 全ての要素の高さをログ出力
  console.log("Balance Sheet Chart - Element Heights:");
  nodes.forEach((node) => {
    console.log(`${node.name}: ${node.height}px`);
  });

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

  // ラベル表示関数
  const renderLabel = (node: BalanceSheetNode) => {
    const isDebtExcess = node.name === BALANCE_SHEET_LABELS.debtExcess;
    const textColor = isDebtExcess ? "fill-red-600" : "fill-black";

    // 高さが30以下の場合：一行表示
    if (node.height <= 30) {
      return (
        <text
          x={node.x + node.width / 2}
          y={node.y + node.height / 2 - 2}
          textAnchor="middle"
          dominantBaseline="central"
          className={`pointer-events-none ${textColor}`}
        >
          {isDebtExcess && (
            <tspan
              fontSize="14"
              fontWeight="700"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              ▲
            </tspan>
          )}
          <tspan
            fontSize="14"
            fontWeight="700"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            dx={isDebtExcess ? "4" : "0"}
          >
            {node.name}{" "}
          </tspan>
          {formatAmount(node.value)
            .split(/(\d+)/)
            .map((part, partIndex) => {
              const isNumber = /^\d+$/.test(part);
              return (
                <tspan
                  key={`${node.name}-${partIndex}-${part}`}
                  fontSize={isNumber ? "16" : "12"}
                  fontWeight={isNumber ? "700" : "500"}
                  dx={partIndex > 0 ? "2" : "0"}
                  style={{
                    fontFamily: isNumber
                      ? "'SF Pro', -apple-system, system-ui, sans-serif"
                      : "'Noto Sans JP', sans-serif",
                  }}
                >
                  {part}
                </tspan>
              );
            })}
        </text>
      );
    }

    // 高さが30より大きい場合：二行表示
    return (
      <>
        {/* ラベル */}
        <text
          x={node.x + node.width / 2}
          y={node.y + node.height / 2 - 10}
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          className={`pointer-events-none font-bold ${textColor}`}
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          {node.name}
        </text>

        {/* 金額 */}
        <text
          x={node.x + node.width / 2}
          y={node.y + node.height / 2 + 15}
          textAnchor="middle"
          className={`pointer-events-none ${textColor}`}
        >
          {isDebtExcess && (
            <tspan
              fontSize="18"
              fontWeight="700"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              ▲
            </tspan>
          )}
          {formatAmount(node.value)
            .split(/(\d+)/)
            .map((part, partIndex) => {
              const isNumber = /^\d+$/.test(part);
              return (
                <tspan
                  key={`${node.name}-${partIndex}-${part}`}
                  fontSize={isNumber ? "20" : "14"}
                  fontWeight={isNumber ? "700" : "500"}
                  dx={partIndex > 0 ? "4" : "0"}
                  style={{
                    fontFamily: isNumber
                      ? "'SF Pro', -apple-system, system-ui, sans-serif"
                      : "'Noto Sans JP', sans-serif",
                  }}
                >
                  {part}
                </tspan>
              );
            })}
        </text>
      </>
    );
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-[500px] relative">
        <svg
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="w-full h-auto"
          role="img"
          aria-label="貸借対照表チャート"
        >
          {nodes.map((node) => (
            <g key={node.name}>
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                fill={
                  node.name === BALANCE_SHEET_LABELS.debtExcess
                    ? "transparent"
                    : node.color
                }
                stroke={
                  node.name === BALANCE_SHEET_LABELS.debtExcess
                    ? COLORS.DEBT_EXCESS_STROKE
                    : COLORS.WHITE
                }
                strokeWidth={
                  node.name === BALANCE_SHEET_LABELS.debtExcess ? 1 : 2
                }
                strokeDasharray={
                  node.name === BALANCE_SHEET_LABELS.debtExcess ? "2,2" : "none"
                }
                className="cursor-pointer"
              />
              {renderLabel(node)}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
