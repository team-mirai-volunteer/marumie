"use client";
import "client-only";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import type { PortfolioData } from "@/server/contexts/public-finance/domain/models/portfolio";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[360px]">
      <div className="text-center text-gray-500">
        <div className="text-lg font-medium mb-2">チャート読み込み中...</div>
      </div>
    </div>
  ),
});

const CATEGORY_COLORS: Record<string, string> = {
  cash: "#5EEAD4",
  stocks: "#2DD4BF",
  precious_metals: "#F59E0B",
  real_estate: "#60A5FA",
  other: "#A78BFA",
};

const DEFAULT_COLOR = "#9CA3AF";

interface PortfolioPieChartProps {
  data: PortfolioData;
}

function formatAmount(amount: number): string {
  if (amount >= 100_000_000) {
    const oku = Math.floor(amount / 100_000_000);
    const man = Math.floor((amount % 100_000_000) / 10_000);
    return man > 0 ? `${oku}億${man}万円` : `${oku}億円`;
  }
  if (amount >= 10_000) {
    const man = Math.floor(amount / 10_000);
    const en = amount % 10_000;
    return en > 0 ? `${man}万${en}円` : `${man}万円`;
  }
  return `${amount}円`;
}

export default function PortfolioPieChart({ data }: PortfolioPieChartProps) {
  if (!data.assets || data.assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-[360px]">
        <div className="text-center text-gray-500">
          <div className="text-sm">データがありません</div>
        </div>
      </div>
    );
  }

  const labels = data.assets.map((a) => a.label);
  const series = data.assets.map((a) => a.amount);
  const colors = data.assets.map((a) => CATEGORY_COLORS[a.category] ?? DEFAULT_COLOR);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      toolbar: { show: false },
    },
    labels,
    colors,
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "13px",
        fontFamily: "Noto Sans JP, sans-serif",
        fontWeight: 700,
        colors: ["#1E293B"],
      },
      dropShadow: { enabled: false },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "合計",
              fontSize: "14px",
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              color: "#4B5563",
              formatter: () => formatAmount(data.totalAmount),
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              color: "#1E293B",
              formatter: (val: string) => formatAmount(Number(val)),
            },
          },
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      fontFamily: "Noto Sans JP, sans-serif",
      fontWeight: 700,
      labels: { colors: "#4B5563" },
      markers: {
        size: 8,
        strokeWidth: 0,
        shape: "square" as const,
      },
      itemMargin: { horizontal: 8, vertical: 4 },
    },
    tooltip: {
      style: {
        fontSize: "13px",
        fontFamily: "Noto Sans JP, sans-serif",
      },
      y: {
        formatter: (val: number) => formatAmount(val),
      },
    },
    stroke: {
      width: 2,
      colors: ["#ffffff"],
    },
  };

  return (
    <div className="flex justify-center" role="img" aria-label="ポートフォリオ円グラフ">
      <div style={{ width: "100%", maxWidth: 500 }}>
        <Chart options={options} series={series} type="donut" height={360} />
      </div>
    </div>
  );
}
