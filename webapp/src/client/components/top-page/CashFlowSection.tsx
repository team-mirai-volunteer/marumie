"use client";
import "client-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import SankeyChart from "@/client/components/top-page/features/charts/SankeyChart";
import FinancialSummarySection from "@/client/components/top-page/features/financial-summary/FinancialSummarySection";

import type { SankeyData } from "@/types/sankey";

interface CashFlowSectionProps {
  sankeyData: SankeyData | null;
  updatedAt: string;
}

export default function CashFlowSection({
  sankeyData,
  updatedAt,
}: CashFlowSectionProps) {
  return (
    <MainColumnCard id="cash-flow">
      <CardHeader
        icon={
          <Image
            src="/icons/icon-cashflow.svg"
            alt="Cash flow icon"
            width={30}
            height={31}
          />
        }
        title="チームみらいの収支の流れ"
        updatedAt={updatedAt}
        subtitle="どこからお金を得て、何に使っているか"
      />

      {/* 財務サマリー */}
      <FinancialSummarySection sankeyData={sankeyData} />

      {sankeyData ? (
        <SankeyChart data={sankeyData} />
      ) : (
        <div className="text-gray-500">
          サンキー図データが取得できませんでした
        </div>
      )}
    </MainColumnCard>
  );
}
