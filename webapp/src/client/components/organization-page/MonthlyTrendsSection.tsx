"use client";
import "client-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

interface MonthlyData {
  yearMonth: string;
  income: number;
  expense: number;
}

interface MonthlyTrendsSectionProps {
  monthlyData?: MonthlyData[];
}

export default function MonthlyTrendsSection({ monthlyData }: MonthlyTrendsSectionProps) {
  return (
    <MainColumnCard>
      <CardHeader
        icon={
          <Image
            src="/icons/icon-barchart.svg"
            alt="Bar chart icon"
            width={30}
            height={30}
          />
        }
        title="１年間の収支の推移"
        updatedAt="2025.8.14時点"
        subtitle="チームみらいは毎月いくらの収入と支出があるか"
      />

      {/* 月次データ表示 */}
      {monthlyData && monthlyData.length > 0 ? (
        <div className="space-y-4">
          <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">月次収支推移グラフ</div>
              <div className="text-sm">実装予定</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">月次データ（JSON形式）:</h4>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-32">
              {JSON.stringify(monthlyData, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="h-[462px] bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-lg font-medium mb-2">月次収支推移グラフ</div>
            <div className="text-sm">データがありません</div>
          </div>
        </div>
      )}
    </MainColumnCard>
  );
}
