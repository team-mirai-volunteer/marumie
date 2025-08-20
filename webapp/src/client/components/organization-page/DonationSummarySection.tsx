import "server-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import BaseCard from "@/client/components/ui/BaseCard";
import type { DonationSummaryData } from "@/server/usecases/get-daily-donation-usecase";

interface DonationSummarySectionProps {
  donationSummary?: DonationSummaryData;
}

export default function DonationSummarySection({
  donationSummary,
}: DonationSummarySectionProps) {
  // サーバーサイドで計算された統計情報を使用
  const totalDonationAmount = donationSummary?.totalAmount || 0;
  const totalDonationDays = donationSummary?.totalDays || 0;
  const dayOverDayChange = donationSummary?.amountDayOverDay || 0;
  const donationCountChange = donationSummary?.countDayOverDay || 0;
  const dailyDonationData = donationSummary?.dailyDonationData || [];

  // 金額を億・万・円に分解する関数
  const formatLargeAmount = (amount: number) => {
    const oku = Math.floor(amount / 100000000); // 億
    const man = Math.floor((amount % 100000000) / 10000); // 万
    const en = amount % 10000; // 円

    return { oku, man, en };
  };

  const {
    oku: totalOku,
    man: totalMan,
    en: totalEn,
  } = formatLargeAmount(totalDonationAmount);

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
        subtitle="チームみらいにいただいた寄付金額と推移"
      />

      {/* 寄付統計サマリー */}
      <div className="flex items-center gap-6">
        {/* 寄付金額カード */}
        <BaseCard className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#000000] font-bold text-base">
              累計寄付金額
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-[#6B7280]">前日比</span>
              <span
                className={`font-bold ${dayOverDayChange > 0 ? "text-[#238778]" : dayOverDayChange < 0 ? "text-red-500" : "text-[#6B7280]"}`}
              >
                {dayOverDayChange > 0 ? "+" : ""}
                {dayOverDayChange.toLocaleString()}
              </span>
              <span className="text-[#6B7280]">円</span>
            </div>
          </div>
          <div className="flex items-end gap-1">
            {totalOku > 0 && (
              <>
                <span
                  className="font-bold text-[40px] leading-[30px]"
                  style={{ color: "#000000" }}
                >
                  {totalOku}
                </span>
                <span
                  className="font-bold text-base"
                  style={{ color: "#000000" }}
                >
                  億
                </span>
              </>
            )}
            {totalMan > 0 && (
              <>
                <span
                  className="font-bold text-[40px] leading-[30px]"
                  style={{ color: "#000000" }}
                >
                  {totalMan}
                </span>
                <span
                  className="font-bold text-base"
                  style={{ color: "#000000" }}
                >
                  万
                </span>
              </>
            )}
            <span
              className="font-bold text-[40px] leading-[30px]"
              style={{ color: "#000000" }}
            >
              {totalEn}
            </span>
            <span className="font-bold text-base" style={{ color: "#000000" }}>
              円
            </span>
          </div>
        </BaseCard>

        {/* 寄付件数カード */}
        <BaseCard className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#000000] font-bold text-base">寄付件数</div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-[#6B7280]">前日比</span>
              <span
                className={`font-bold ${donationCountChange > 0 ? "text-[#238778]" : donationCountChange < 0 ? "text-red-500" : "text-[#6B7280]"}`}
              >
                {donationCountChange > 0 ? "+" : ""}
                {donationCountChange}
              </span>
              <span className="text-[#6B7280]">件</span>
            </div>
          </div>
          <div className="flex items-end gap-1">
            <span
              className="font-bold text-[40px] leading-[30px]"
              style={{ color: "#000000" }}
            >
              {totalDonationDays}
            </span>
            <span className="font-bold text-base" style={{ color: "#000000" }}>
              件
            </span>
          </div>
        </BaseCard>

        {/* 企業団体献金カード */}
        <BaseCard className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#000000] font-bold text-base">
              企業団体献金
            </div>
          </div>
          <div className="flex items-end gap-1">
            <span
              className="font-bold text-[40px] leading-[30px]"
              style={{ color: "#000000" }}
            >
              0
            </span>
            <span className="font-bold text-base" style={{ color: "#000000" }}>
              件
            </span>
          </div>
        </BaseCard>
      </div>

      {/* 寄付データ詳細表示 */}
      {dailyDonationData.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Data</h4>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-32">
              {JSON.stringify(dailyDonationData, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="h-[287px] bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-lg font-medium mb-2">寄付データ</div>
            <div className="text-sm">データがありません</div>
          </div>
        </div>
      )}

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
