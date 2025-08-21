import "server-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import BaseCard from "@/client/components/ui/BaseCard";
import MainButton from "@/client/components/ui/MainButton";
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
      <div className="flex flex-col md:flex-row gap-2 md:gap-6">
        {/* 寄付金額カード - SPでは1つのカード */}
        <BaseCard className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-0 md:mb-4">
            <div className="text-[#4B5563] font-bold text-sm md:text-base">
              寄付金額
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
              <div className="flex items-baseline gap-[2px]">
                {totalOku > 0 && (
                  <>
                    <span className="font-bold text-2xl md:text-[40px] leading-5 md:leading-[30px] text-[#1F2937]">
                      {totalOku}
                    </span>
                    <span className="font-bold text-xs md:text-base text-[#6B7280] md:text-[#1F2937]">
                      億
                    </span>
                  </>
                )}
                {totalMan > 0 && (
                  <>
                    <span className="font-bold text-2xl md:text-[40px] leading-5 md:leading-[30px] text-[#1F2937]">
                      {totalMan}
                    </span>
                    <span className="font-bold text-xs md:text-base text-[#6B7280] md:text-[#1F2937]">
                      万
                    </span>
                  </>
                )}
                <span className="font-bold text-2xl md:text-[40px] leading-5 md:leading-[30px] text-[#1F2937]">
                  {totalEn}
                </span>
                <span className="font-bold text-xs md:text-base text-[#6B7280] md:text-[#1F2937]">
                  円
                </span>
              </div>
              <div className="flex items-center gap-[2px] md:ml-4">
                <span className="text-[#238778] font-normal text-[11px]">
                  前日比
                </span>
                <div className="flex items-center gap-[2px]">
                  <span className="font-bold text-[#238778] text-[13px]">
                    {dayOverDayChange.toLocaleString()}円
                  </span>
                  <Image
                    src="/icons/icon-arrow-up.svg"
                    alt="上向き矢印"
                    width={13}
                    height={13}
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* PCレイアウト用の金額表示 */}
          <div className="hidden md:flex items-baseline gap-1">
            {totalOku > 0 && (
              <>
                <span className="font-bold text-[40px] leading-[30px] text-[#1F2937]">
                  {totalOku}
                </span>
                <span className="font-bold text-base leading-[30px] text-[#1F2937]">
                  億
                </span>
              </>
            )}
            {totalMan > 0 && (
              <>
                <span className="font-bold text-[40px] leading-[30px] text-[#1F2937]">
                  {totalMan}
                </span>
                <span className="font-bold text-base leading-[30px] text-[#1F2937]">
                  万
                </span>
              </>
            )}
            <span className="font-bold text-[40px] leading-[30px] text-[#1F2937]">
              {totalEn}
            </span>
            <span className="font-bold text-base leading-[30px] text-[#1F2937]">
              円
            </span>
          </div>
        </BaseCard>

        {/* 寄付件数と企業団体献金 - SPでは横並び */}
        <div className="flex gap-2 md:gap-6">
          {/* 寄付件数カード */}
          <BaseCard className="flex-1 md:w-60">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-0 md:mb-4">
              <div className="text-[#4B5563] font-bold text-sm md:text-base">寄付件数</div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                <div className="flex items-baseline gap-[2px]">
                  <span className="font-bold text-2xl md:text-[40px] leading-5 md:leading-[30px] text-[#1F2937]">
                    {totalDonationDays}
                  </span>
                  <span className="font-bold text-xs md:text-base text-[#4B5563] md:text-[#1F2937]">
                    件
                  </span>
                </div>
                <div className="flex items-center gap-[1.5px] md:ml-4">
                  <span className="text-[#238778] font-normal text-[11px]">
                    前日比
                  </span>
                  <div className="flex items-center gap-[2px]">
                    <span className="font-bold text-[#238778] text-[13px]">
                      {donationCountChange}
                    </span>
                    <span className="text-[#238778] font-normal text-[11px]">
                      件
                    </span>
                    <Image
                      src="/icons/icon-arrow-up.svg"
                      alt="上向き矢印"
                      width={13}
                      height={13}
                      className="flex-shrink-0"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* PCレイアウト用の件数表示 */}
            <div className="hidden md:flex items-baseline gap-1">
              <span className="font-bold text-[40px] leading-[30px] text-[#1F2937]">
                {totalDonationDays}
              </span>
              <span className="font-bold text-base leading-[30px] text-[#1F2937]">
                件
              </span>
            </div>
          </BaseCard>

          {/* 企業団体献金カード */}
          <BaseCard className="flex-1 md:w-60">
            <div className="flex flex-col gap-3 md:gap-0 md:mb-4">
              <div className="text-[#4B5563] font-bold text-[13px] md:text-base leading-[18px] whitespace-pre-line md:whitespace-normal">
                {"企業\n団体献金"}
              </div>
              <div className="flex items-baseline gap-[2px]">
                <span className="font-bold text-2xl md:text-[40px] leading-5 md:leading-[30px] text-[#1F2937]">
                  0
                </span>
                <span className="font-bold text-xs md:text-base text-[#4B5563] md:text-[#1F2937]">
                  件
                </span>
              </div>
            </div>
            {/* PCレイアウト用の件数表示 */}
            <div className="hidden md:flex items-baseline gap-1">
              <span className="font-bold text-[40px] leading-[30px] text-[#1F2937]">
                0
              </span>
              <span className="font-bold text-base leading-[30px] text-[#1F2937]">
                件
              </span>
            </div>
          </BaseCard>
        </div>
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
        <p className="text-[#1F2937] font-bold text-base mb-6">
          チームみらいは、皆さまのご支援・ご寄付のおかげで活動を続けられております。
        </p>
        <MainButton>ご寄付はこちら</MainButton>
      </div>
    </MainColumnCard>
  );
}
