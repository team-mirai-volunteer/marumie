"use client";
import "client-only";
import Image from "next/image";
import FinancialSummarySection from "@/client/components/organization-page/components/FinancialSummarySection";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import SankeyChart from "@/client/components/organization-page/components/SankeyChart";

import type { SankeyData } from "@/types/sankey";

interface CashFlowSectionProps {
  sankeyData: SankeyData | null;
}

export default function CashFlowSection({ sankeyData }: CashFlowSectionProps) {
  return (
    <MainColumnCard>
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
        updatedAt="2025.8.14時点"
        subtitle="チームみらいはどこからお金を得て、何に使っているのか"
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
