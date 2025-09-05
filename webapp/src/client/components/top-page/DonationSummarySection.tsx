import "server-only";
import Image from "next/image";
import Link from "next/link";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import MainButton from "@/client/components/ui/MainButton";
import type { DonationSummaryData } from "@/server/usecases/get-daily-donation-usecase";
import DonationChart from "./features/charts/DonationChart";
import DonationSummaryCards from "./features/donation-summary/DonationSummaryCards";

interface DonationSummarySectionProps {
  donationSummary?: DonationSummaryData;
  updatedAt: string;
}

export default function DonationSummarySection({
  donationSummary,
  updatedAt,
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
        updatedAt={updatedAt}
        subtitle="いただいた寄付総額と直近3ヶ月の推移"
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

      {/* 寄付推移グラフ */}
      <DonationChart data={dailyDonationData} />

      {/* 寄付メッセージとボタン */}
      <div className="bg-white rounded-lg px-8 text-center">
        <p className="text-gray-800 font-bold text-base leading-7 mb-6">
          チームみらいは、皆さまのご支援・ご寄付のおかげで活動を続けられております。
        </p>
        <Link
          href="https://team-mir.ai/support/donation"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MainButton>ご寄付はこちら</MainButton>
        </Link>
      </div>
    </MainColumnCard>
  );
}
