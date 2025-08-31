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

  // データの最大絶対値を取得してY軸の範囲を動的に設定
  const allValues = [...incomeData, ...expenseData, ...balanceData];
  const maxAbsValue = Math.max(...allValues.map((val) => Math.abs(val)));
  const maxWithMargin = maxAbsValue * 1.2; // 20%のマージンを追加

  // maxAbsValueに応じて刻み幅を決定し、四捨五入
  let yAxisMax: number;
  let tickInterval: number;
  if (maxAbsValue > 100000000) {
    // 1億円より大きい場合は1000万円刻み
    tickInterval = 10000000;
    yAxisMax = Math.round(maxWithMargin / tickInterval) * tickInterval;
  } else {
    // 1億円以下の場合は100万円刻み
    tickInterval = 1000000;
    yAxisMax = Math.round(maxWithMargin / tickInterval) * tickInterval;
  }
  const yAxisMin = -yAxisMax;

  // 明示的な目盛り位置を生成
  const tickValues: number[] = [];
  for (let i = yAxisMin; i <= yAxisMax; i += tickInterval) {
    tickValues.push(i);
  }

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
      zoom: {
        enabled: false,
      },
      selection: {
        enabled: false,
      },
      events: {
        beforeMount: (chartContext: { el: HTMLElement }) => {
          // チャートコンテナのタッチイベントを親要素に委譲
          if (typeof window !== "undefined" && "ontouchstart" in window) {
            const chartEl = chartContext.el;
            chartEl.style.touchAction = "pan-x pan-y";
          }
        },
      },
    },
    colors: ["#2AA693", "#DC2626", "#4B5563"],
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
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
        show: true,
        color: "#E2E8F0",
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
            const manEn = val / 10000; // 円を万円に変換
            const absManEn = Math.abs(manEn);
            if (absManEn >= 10000) {
              return `${(manEn / 10000).toFixed(0)}億円`;
            }
            return `${manEn.toFixed(0)}万円`;
          },
          style: {
            colors: "#4B5563",
            fontSize: "14px",
            fontFamily: "Noto Sans JP, sans-serif",
            fontWeight: 500,
          },
        },
        min: yAxisMin,
        max: yAxisMax,
        tickAmount: 4,
        forceNiceScale: false,
        // ApexChartsのY軸設定では、tickAmountで目盛り数を制御
        axisBorder: {
          show: true,
          color: "#E2E8F0",
        },
        axisTicks: {
          show: false,
        },
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
          show: false,
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
        size: 6,
        strokeWidth: 0,
        shape: "square" as const,
      },
      itemMargin: {
        horizontal: 6,
        vertical: 0,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: ({ series, dataPointIndex }) => {
        const yearMonth = data[dataPointIndex].yearMonth;
        const [, month] = yearMonth.split("-");
        const monthNumber = parseInt(month, 10);
        const balance = series[2][dataPointIndex];

        const balanceManEn = (balance / 10000).toFixed(0);
        const formattedBalance = parseInt(balanceManEn).toLocaleString();
        const balanceSign = balance >= 0 ? "+" : "";
        const balanceColor = balance >= 0 ? "#238778" : "#DC2626";

        return `
          <div class="custom-tooltip">
            <div class="tooltip-title">${monthNumber}月収支</div>
            <div class="tooltip-balance" style="color: ${balanceColor}">${balanceSign}${formattedBalance}万円</div>
          </div>
        `;
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
        {
          y: yAxisMin,
          borderColor: "#E2E8F0",
          borderWidth: 1,
          strokeDashArray: 0,
        },
      ],
    },
  };

  return (
    <div
      className="overflow-x-auto overflow-y-hidden rounded-lg bg-white"
      role="img"
      aria-label="月次収支推移グラフ"
      aria-describedby="monthly-chart-description"
    >
      <div id="monthly-chart-description" className="sr-only">
        1年間の月別収入、支出、収支の推移を示す棒グラフです。
      </div>
      <div className="min-w-[600px]" style={{ height: 462 }}>
        <Chart options={options} series={series} type="line" height={462} />
        <style jsx global>{`
          .apexcharts-tooltip-title {
            display: none !important;
          }
          .apexcharts-xaxistooltip {
            display: none !important;
          }
          .custom-tooltip {
            background: rgba(255, 255, 255, 0.92);
            border: 1px solid #64748B;
            border-radius: 6px;
            padding: 8px 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            font-family: 'Noto Sans JP', sans-serif;
            position: relative;
          }
          .tooltip-title {
            font-weight: 700;
            font-size: 13px;
            line-height: 1.31;
            color: #4B5563;
            margin-bottom: 3px;
          }
          .tooltip-balance {
            font-weight: 700;
            font-size: 14px;
            line-height: 1.5;
          }
          .apexcharts-canvas:hover {
            cursor: pointer;
          }
          .apexcharts-series path,
          .apexcharts-series rect {
            cursor: pointer;
          }
        `}</style>
      </div>
    </div>
  );
}
