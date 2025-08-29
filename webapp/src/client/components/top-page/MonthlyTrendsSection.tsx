import "server-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import MonthlyChart from "./features/charts/MonthlyChart";

interface MonthlyData {
  yearMonth: string;
  income: number;
  expense: number;
}

interface MonthlyTrendsSectionProps {
  monthlyData?: MonthlyData[];
  updatedAt: string;
}

export default function MonthlyTrendsSection({
  monthlyData,
  updatedAt,
}: MonthlyTrendsSectionProps) {
  return (
    <MainColumnCard id="monthly-trends">
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
        updatedAt={updatedAt}
        subtitle="今年の年始から月ごとの収入と支出"
      />

      {/* 月次チャート表示 - モバイルのみ右端まで拡張 */}
      <div className="-mr-[18px] sm:mr-0">
        <MonthlyChart data={monthlyData || []} />
      </div>
    </MainColumnCard>
  );
}
