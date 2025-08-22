"use client";
import "client-only";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// ApexChartsを動的インポート（SSR対応）
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-50 rounded-lg flex items-center justify-center h-[462px]">
      <div className="text-center text-gray-500">
        <div className="text-lg font-medium mb-2">チャート読み込み中...</div>
      </div>
    </div>
  ),
});

interface MonthlyData {
  yearMonth: string;
  income: number;
  expense: number;
}

interface MonthlyChartProps {
  data: MonthlyData[];
}

export default function MonthlyChart({ data }: MonthlyChartProps) {
  // データが空の場合
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg flex items-center justify-center h-[462px]">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">月次収支推移グラフ</div>
          <div className="text-sm">データがありません</div>
        </div>
      </div>
    );
  }

  // 月のラベルを生成（1月〜12月）
  const months = data.map((item) => {
    const [, month] = item.yearMonth.split("-");
    return `${parseInt(month, 10)}月`;
  });

  // 収入・支出・収支データを準備
  const incomeData = data.map((item) => item.income);
  const expenseData = data.map((item) => -item.expense); // 負の値で表現
  const balanceData = data.map((item) => item.income - item.expense);

  // ApexChartsのseries設定
  const series = [
    {
      name: "収入",
      type: "column" as const,
      data: incomeData,
    },
    {
      name: "支出",
      type: "column" as const,
      data: expenseData,
    },
    {
      name: "収支",
      type: "line" as const,
      data: balanceData,
    },
  ];

  // ApexChartsのオプション設定
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 462,
      stacked: true,
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    colors: ["#2AA693", "#DC2626", "#4B5563"],
    plotOptions: {
      bar: {
        columnWidth: "35px",
      },
    },
    stroke: {
      width: [0, 0, 2],
      curve: "smooth",
    },
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: "#4B5563",
          fontSize: "14px",
          fontFamily: "Noto Sans JP, sans-serif",
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {
        title: {
          text: undefined,
        },
        labels: {
          formatter: (val: number) => {
            if (val === 0) return "0万円";
            const absVal = Math.abs(val);
            if (absVal >= 10000) {
              return `${(absVal / 10000).toFixed(0)}億円`;
            }
            return `${absVal.toFixed(0)}万円`;
          },
          style: {
            colors: "#4B5563",
            fontSize: "14px",
            fontFamily: "Noto Sans JP, sans-serif",
            fontWeight: 500,
          },
        },
        min: -500,
        max: 500,
        tickAmount: 4,
      },
    ],
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "right",
      fontSize: "14px",
      fontFamily: "Noto Sans JP, sans-serif",
      fontWeight: 700,
      labels: {
        colors: "#4B5563",
      },
      markers: {
        size: 12,
        strokeWidth: 0,
        shape: "square" as const,
      },
      itemMargin: {
        horizontal: 24,
        vertical: 0,
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1], // 収入・支出バーのみ
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        colors: ["#6B7280"],
      },
      formatter: (val: number) => {
        const absVal = Math.abs(val);
        if (absVal === 0) return "";
        return `${absVal}万`;
      },
      offsetY: -5,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number, { seriesIndex }) => {
          const absVal = Math.abs(val);
          if (seriesIndex === 2) {
            // 収支の場合
            return `${val >= 0 ? "+" : ""}${val}万円`;
          }
          return `${absVal}万円`;
        },
      },
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: "#4B5563",
          borderWidth: 1,
          strokeDashArray: 0,
        },
      ],
    },
  };

  return (
    <div className="bg-white rounded-lg" style={{ height: 462 }}>
      <Chart options={options} series={series} type="line" height={462} />
    </div>
  );
}
