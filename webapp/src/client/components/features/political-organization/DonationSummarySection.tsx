'use client';
import 'client-only';
import Image from "next/image";
import ComplexDonationSummaryCard from "@/client/components/features/summary/ComplexDonationSummaryCard";
import DonationSummaryCard from "@/client/components/features/summary/DonationSummaryCard";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

interface DonationSummarySectionProps {
  // 将来的に寄付統計データを追加
}

export default function DonationSummarySection({}: DonationSummarySectionProps) {
  return (
    <MainColumnCard>
      <CardHeader
        icon={
          <Image
            src="/icons/icon-heart-handshake.svg"
            alt="Heart handshake icon"
            width={30}
            height={30}
          />
        }
        title="これまでの累計寄付金額"
        updatedAt="2025.8.14時点"
        subtitle="チームみらいにいただいた寄付金額と1ヶ月の推移"
      />

      {/* 寄付統計サマリー */}
      <div className="flex items-center gap-6">
        <ComplexDonationSummaryCard
          className="flex-1"
          title="寄付金額"
          mainValue="1"
          mainUnit="億"
          secondaryValue="7462"
          secondaryUnit="万"
          tertiaryValue="4000"
          finalUnit="円"
          previousDayChange={{
            value: "8,000",
            unit: "円",
          }}
        />

        <DonationSummaryCard
          className="flex-1"
          title="寄付件数"
          value="7118"
          unit="件"
          previousDayChange={{
            value: "12",
            unit: "件",
          }}
        />

        <DonationSummaryCard
          className="flex-1"
          title="企業団体献金"
          value="0"
          unit="件"
        />
      </div>

      {/* プレースホルダーグラフ */}
      <div className="h-[287px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">寄付金額推移グラフ</div>
          <div className="text-sm">実装予定</div>
        </div>
      </div>

      {/* 寄付メッセージとボタン */}
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-[#000000] font-bold text-base mb-6">
          チームみらいは、皆さまのご支援・ご寄付のおかげで活動を続けられております。
        </p>
        <button
          type="button"
          className="bg-gradient-to-r from-[#BCECD3] to-[#64D8C6] border border-black rounded-[40px] px-6 py-2 text-[#000000] font-bold text-base hover:opacity-90 transition-opacity"
        >
          ご寄付はこちら
        </button>
      </div>
    </MainColumnCard>
  );
}