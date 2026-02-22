import "server-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import type { PortfolioData } from "@/server/contexts/public-finance/domain/models/portfolio";
import PortfolioPieChart from "./features/charts/PortfolioPieChart";

interface PortfolioSectionProps {
  data?: PortfolioData;
  updatedAt: string;
  organizationName?: string;
}

export default function PortfolioSection({
  data,
  updatedAt,
  organizationName,
}: PortfolioSectionProps) {
  return (
    <MainColumnCard id="portfolio">
      <CardHeader
        icon={<Image src="/icons/balance.svg" alt="Portfolio icon" width={30} height={30} />}
        organizationName={organizationName || "未登録の政治団体"}
        title="保有資産ポートフォリオ"
        updatedAt={updatedAt}
        subtitle="資産カテゴリ別の内訳"
      />

      {data && data.assets.length > 0 ? (
        <>
          {data.snapshotDate && (
            <p className="text-sm text-gray-500 text-center">{data.snapshotDate} 時点</p>
          )}
          <PortfolioPieChart data={data} />
        </>
      ) : (
        <div className="flex justify-center items-center h-80 text-gray-500">
          データがありません
        </div>
      )}

      <div className="mt-4 text-right md:hidden">
        <span className="text-xs font-normal text-[#9CA3AF] leading-[1.33]">{updatedAt}</span>
      </div>
    </MainColumnCard>
  );
}
