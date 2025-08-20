'use client';
import 'client-only';
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

interface MonthlyTrendsSectionProps {
  // 将来的に月次データを追加
}

export default function MonthlyTrendsSection({}: MonthlyTrendsSectionProps) {
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

      {/* プレースホルダーグラフ */}
      <div className="h-[462px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">月次収支推移グラフ</div>
          <div className="text-sm">実装予定</div>
        </div>
      </div>
    </MainColumnCard>
  );
}