"use client";

import { ResponsiveTreeMap } from "@nivo/treemap";
import type { BalanceSheetData, TreemapData } from "@/types/balance-sheet";
import { BALANCE_SHEET_LABELS } from "@/types/balance-sheet";

interface BalanceSheetChartProps {
  data: BalanceSheetData;
}

export default function BalanceSheetChart({ data }: BalanceSheetChartProps) {
  // バランスシートデータをTreemap用に変換
  const convertToTreemapData = (
    balanceSheet: BalanceSheetData,
  ): TreemapData[] => {
    const leftSideData: TreemapData = {
      name: "資産",
      children: [],
    };

    const rightSideData: TreemapData = {
      name: "負債・資本",
      children: [],
    };

    // 左側（資産）のデータを変換
    if (balanceSheet.left.currentAssets > 0) {
      leftSideData.children.push({
        name: BALANCE_SHEET_LABELS.currentAssets,
        value: balanceSheet.left.currentAssets,
        color: "#99F6E4", // cyan-200
      });
    }

    if (balanceSheet.left.fixedAssets > 0) {
      leftSideData.children.push({
        name: BALANCE_SHEET_LABELS.fixedAssets,
        value: balanceSheet.left.fixedAssets,
        color: "#2DD4BF", // teal-400
      });
    }

    if (balanceSheet.left.debtExcess > 0) {
      leftSideData.children.push({
        name: BALANCE_SHEET_LABELS.debtExcess,
        value: balanceSheet.left.debtExcess,
        color: "#FCA5A5", // red-300, dashed border will be handled separately
      });
    }

    // 右側（負債・資本）のデータを変換
    if (balanceSheet.right.currentLiabilities > 0) {
      rightSideData.children.push({
        name: BALANCE_SHEET_LABELS.currentLiabilities,
        value: balanceSheet.right.currentLiabilities,
        color: "#FECACA", // red-200
      });
    }

    if (balanceSheet.right.fixedLiabilities > 0) {
      rightSideData.children.push({
        name: BALANCE_SHEET_LABELS.fixedLiabilities,
        value: balanceSheet.right.fixedLiabilities,
        color: "#F87171", // red-400
      });
    }

    if (balanceSheet.right.netAssets > 0) {
      rightSideData.children.push({
        name: BALANCE_SHEET_LABELS.netAssets,
        value: balanceSheet.right.netAssets,
        color: "#A3E635", // lime-400
      });
    }

    return [leftSideData, rightSideData];
  };

  const treemapData = convertToTreemapData(data);

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
    <div className="flex justify-center gap-8 mt-10">
      {treemapData.map((sideData) => (
        <div key={sideData.name} className="w-64 h-96">
          <h3 className="text-center font-bold text-lg mb-4 text-gray-800">
            {sideData.name}
          </h3>
          <div className="h-80 bg-gray-50 rounded-lg overflow-hidden">
            <ResponsiveTreeMap
              data={sideData}
              identity="name"
              value="value"
              tile="binary"
              leavesOnly={true}
              innerPadding={2}
              outerPadding={2}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              labelSkipSize={12}
              labelTextColor="#000000"
              colors={(node) => node.data.color || "#E5E7EB"}
              borderColor="#ffffff"
              borderWidth={2}
              label={(node) => {
                const value = typeof node.value === "number" ? node.value : 0;
                return `${node.id}\n${formatAmount(value)}`;
              }}
              tooltip={({ node }) => {
                const value = typeof node.value === "number" ? node.value : 0;
                return (
                  <div className="bg-white p-3 shadow-lg rounded-lg border">
                    <div className="font-bold text-gray-800">{node.id}</div>
                    <div className="text-gray-600">{formatAmount(value)}</div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
