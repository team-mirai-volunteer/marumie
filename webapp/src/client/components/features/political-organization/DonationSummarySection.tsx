'use client';
import 'client-only';
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import BaseCard from "@/client/components/ui/BaseCard";
import PreviousDayChange from "@/client/components/ui/PreviousDayChange";
import ValueDisplay from "@/client/components/ui/ValueDisplay";


export default function DonationSummarySection() {
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
        {/* 寄付金額カード */}
        <BaseCard className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#000000] font-bold text-base">寄付金額</div>
            <PreviousDayChange
              value="8,000"
              unit="円"
            />
          </div>
          <ValueDisplay
            parts={[
              { value: "1", isLarge: true },
              { value: "億", isLarge: false },
              { value: "7462", isLarge: true },
              { value: "万", isLarge: false },
              { value: "4000", isLarge: true },
              { value: "円", isLarge: false },
            ]}
          />
        </BaseCard>

        {/* 寄付件数カード */}
        <BaseCard className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#000000] font-bold text-base">寄付件数</div>
            <PreviousDayChange
              value="12"
              unit="件"
            />
          </div>
          <ValueDisplay
            parts={[
              { value: "7118", isLarge: true },
              { value: "件", isLarge: false },
            ]}
          />
        </BaseCard>

        {/* 企業団体献金カード */}
        <BaseCard className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#000000] font-bold text-base">企業団体献金</div>
          </div>
          <ValueDisplay
            parts={[
              { value: "0", isLarge: true },
              { value: "件", isLarge: false },
            ]}
          />
        </BaseCard>
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