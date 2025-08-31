"use client";
import "client-only";
import Image from "next/image";
import { useState } from "react";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import SankeyChart from "@/client/components/top-page/features/charts/SankeyChart";
import FinancialSummarySection from "@/client/components/top-page/features/financial-summary/FinancialSummarySection";

import type { SankeyData } from "@/types/sankey";

interface CashFlowSectionProps {
  political?: SankeyData | null;
  friendly?: SankeyData | null;
  updatedAt: string;
}

export default function CashFlowSection({
  political,
  friendly,
  updatedAt,
}: CashFlowSectionProps) {
  const [activeTab, setActiveTab] = useState<"political" | "friendly">(
    "political",
  );

  const currentData = activeTab === "political" ? political : friendly;

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
      <FinancialSummarySection sankeyData={currentData ?? null} />

      {/* タブ */}
      <div className="flex gap-7 border-b border-gray-300 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("political")}
          className={`pb-2 font-bold text-base border-b-2 transition-colors leading-tight cursor-pointer ${
            activeTab === "political"
              ? "border-[#238778] text-[#238778]"
              : "border-transparent text-[#9CA3AF] hover:text-gray-600"
          }`}
        >
          法律上の区分
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("friendly")}
          className={`pb-2 font-bold text-base border-b-2 transition-colors leading-tight cursor-pointer ${
            activeTab === "friendly"
              ? "border-[#238778] text-[#238778]"
              : "border-transparent text-[#9CA3AF] hover:text-gray-600"
          }`}
        >
          独自の区分
        </button>
      </div>

      {/* サンキー図 */}
      {currentData ? (
        <SankeyChart data={currentData} />
      ) : (
        <div className="text-gray-500">
          サンキー図データが取得できませんでした
        </div>
      )}
    </MainColumnCard>
  );
}
