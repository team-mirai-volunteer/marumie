import "server-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import MonthlyChart from "./components/MonthlyChart";

interface MonthlyData {
  yearMonth: string;
  income: number;
  expense: number;
}

interface MonthlyTrendsSectionProps {
  monthlyData?: MonthlyData[];
}

export default function MonthlyTrendsSection({
  monthlyData,
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
        updatedAt="2025.8.14時点"
        subtitle="今年の年始から月ごとの収入と支出"
      />

      {/* 月次チャート表示 */}
      <MonthlyChart data={monthlyData || []} />
    </MainColumnCard>
  );
}
