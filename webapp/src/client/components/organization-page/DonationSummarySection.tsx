import "server-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import MainButton from "@/client/components/ui/MainButton";
import type { DonationSummaryData } from "@/server/usecases/get-daily-donation-usecase";
import DonationSummaryCards from "./DonationSummaryCards";

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
    <MainColumnCard id="donation-summary">
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
        subtitle="いただいた寄付総額と直近1ヶ月の推移"
      />

      {/* 寄付統計サマリー */}
      <DonationSummaryCards
        totalOku={totalOku}
        totalMan={totalMan}
        totalEn={totalEn}
        totalDonationDays={totalDonationDays}
        dayOverDayChange={dayOverDayChange}
        donationCountChange={donationCountChange}
      />

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
        <p className="text-[#1F2937] font-bold text-base mb-6">
          チームみらいは、皆さまのご支援・ご寄付のおかげで活動を続けられております。
        </p>
        <MainButton>ご寄付はこちら</MainButton>
      </div>
    </MainColumnCard>
  );
}
