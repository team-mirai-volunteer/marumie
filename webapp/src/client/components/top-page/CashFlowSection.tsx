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
  organizationName?: string;
  organizationSlug?: string;
}

export default function CashFlowSection({
  political,
  friendly,
  updatedAt,
  organizationName,
  organizationSlug,
}: CashFlowSectionProps) {
  const [activeTab, setActiveTab] = useState<"political" | "friendly">(
    "friendly",
  );

  const currentData = activeTab === "political" ? political : friendly;

  // 免責文言を組織に応じて選択
  const getDisclaimerText = () => {
    if (organizationSlug === "team-mirai") {
      return "*寄附金額は、政党「チームみらい」が受け取った寄附のみを対象としており、党首・安野や参院選公認候補者の政治団体への寄附は含んでおりません。";
    }

    if (organizationSlug === "digimin") {
      return "*寄附金額は、党首・安野の政治団体が受け取った寄附のみを対象としており、政党「チームみらい」や参院選公認候補者の政治団体への寄附は含んでおりません。";
    }

    return null;
  };

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
        organizationName={organizationName || "未登録の政治団体"}
        title="収支の流れ"
        updatedAt={updatedAt}
        subtitle="どこからお金を得て、何に使っているか"
      />

      {/* 財務サマリー */}
      <FinancialSummarySection sankeyData={currentData ?? null} />

      {/* タブ */}
      <div className="flex gap-7 border-b border-gray-300 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("friendly")}
          className={`pb-2 font-bold text-base border-b-2 transition-colors leading-tight cursor-pointer ${
            activeTab === "friendly"
              ? "border-[#238778] text-[#238778]"
              : "border-transparent text-[#9CA3AF] hover:text-gray-600"
          }`}
        >
          詳細の区分
        </button>
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
      </div>

      {/* サンキー図 */}
      {currentData ? (
        <SankeyChart data={currentData} />
      ) : (
        <div className="text-gray-500">
          サンキー図データが取得できませんでした
        </div>
      )}

      {/* 免責事項 */}
      {getDisclaimerText() && (
        <div className="mt-4 text-right text-xs text-gray-500 leading-relaxed">
          <span className="text-[10px]">{getDisclaimerText()}</span>
        </div>
      )}
    </MainColumnCard>
  );
}
