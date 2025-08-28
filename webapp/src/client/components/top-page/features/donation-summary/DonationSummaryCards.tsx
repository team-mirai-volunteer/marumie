"use client";
import "client-only";
import Image from "next/image";
import BaseCard from "@/client/components/ui/BaseCard";

interface DonationSummaryCardsProps {
  totalOku: number;
  totalMan: number;
  totalEn: number;
  totalDonationDays: number;
  dayOverDayChange: number;
  donationCountChange: number;
}

export default function DonationSummaryCards({
  totalOku,
  totalMan,
  totalEn,
  totalDonationDays,
  dayOverDayChange,
  donationCountChange,
}: DonationSummaryCardsProps) {
  return (
    <>
      {/* SP レイアウト - 3つのカードが縦に並ぶ */}
      <div className="flex md:hidden flex-col gap-2">
        {/* 累計寄付金額カード */}
        <BaseCard className="!p-3">
          <div className="flex flex-row justify-between items-center">
            <div className="text-[#4B5563] font-bold text-sm">累計寄付金額</div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-baseline gap-[2px]">
                {totalOku > 0 && (
                  <>
                    <span className="font-bold text-2xl leading-5 text-gray-800">
                      {totalOku}
                    </span>
                    <span className="font-bold text-xs text-[#6B7280]">億</span>
                  </>
                )}
                {totalMan > 0 && (
                  <>
                    <span className="font-bold text-2xl leading-5 text-gray-800">
                      {totalMan}
                    </span>
                    <span className="font-bold text-xs text-[#6B7280]">万</span>
                  </>
                )}
                <span className="font-bold text-2xl leading-5 text-gray-800">
                  {totalEn}
                </span>
                <span className="font-bold text-xs text-[#6B7280]">円</span>
              </div>
              <div className="flex items-center gap-[2px] h-4">
                <span className="text-[#238778] font-normal text-[11px] leading-3">
                  前日比
                </span>
                <div className="flex items-center">
                  <span className="font-bold text-[#238778] text-[13px] leading-[13px]">
                    {dayOverDayChange.toLocaleString()}円
                  </span>
                  <Image
                    src="/icons/icon-arrow-up.svg"
                    alt="上向き矢印"
                    width={13}
                    height={13}
                    className="flex-shrink-0 ml-[2px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        {/* 寄付件数と企業団体献金 - 横並び */}
        <div className="flex gap-2 items-stretch">
          {/* 寄付件数カード - fill（残りの幅を全て使用） */}
          <BaseCard className="flex-1 !p-3">
            <div className="flex flex-row justify-between items-center gap-3">
              <div className="text-[#4B5563] font-bold text-sm">寄付件数</div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-baseline gap-[2px]">
                  <span className="font-bold text-2xl leading-5 text-gray-800">
                    {totalDonationDays}
                  </span>
                  <span className="font-bold text-xs text-[#4B5563]">件</span>
                </div>
                <div className="flex items-center gap-[1.5px]">
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
          </BaseCard>

          {/* 企業団体献金カード - hug（コンテンツサイズに合わせる） */}
          <BaseCard className="w-fit flex-shrink-0 !p-3 self-stretch">
            <div className="flex flex-row items-center justify-center gap-[2px] h-full">
              <div className="text-[#4B5563] font-bold text-[13px] leading-[18px] whitespace-pre-line w-[63px]">
                {"企業\n団体献金"}
              </div>
              <div className="flex items-baseline gap-[2px]">
                <span className="font-bold text-2xl leading-5 text-gray-800">
                  0
                </span>
                <span className="font-bold text-xs text-[#4B5563]">件</span>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>

      {/* PC レイアウト - 3つのカードが横に並ぶ */}
      <div className="hidden md:flex gap-6">
        {/* 累計寄付金額カード */}
        <BaseCard className="flex-1">
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="text-gray-800 font-bold text-base">
                累計寄付金額
              </div>
              <div className="flex items-center gap-[2px]">
                <span className="text-[#238778] font-bold text-[11px] leading-[17px]">
                  前日比
                </span>
                <Image
                  src="/icons/icon-arrow-up.svg"
                  alt="上向き矢印"
                  width={24}
                  height={24}
                  className="flex-shrink-0"
                />
                <span className="font-bold text-[#238778] text-[16px] leading-[16px]">
                  {dayOverDayChange.toLocaleString()}
                </span>
                <span className="text-[#238778] font-bold text-[11px] leading-[17px]">
                  円
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              {totalOku > 0 && (
                <>
                  <span className="font-bold text-[36px] leading-[30px] text-gray-800">
                    {totalOku}
                  </span>
                  <span className="font-bold text-base leading-[30px] text-gray-800">
                    億
                  </span>
                </>
              )}
              {totalMan > 0 && (
                <>
                  <span className="font-bold text-[36px] leading-[30px] text-gray-800">
                    {totalMan}
                  </span>
                  <span className="font-bold text-base leading-[30px] text-gray-800">
                    万
                  </span>
                </>
              )}
              <span className="font-bold text-[36px] leading-[30px] text-gray-800">
                {totalEn}
              </span>
              <span className="font-bold text-base leading-[30px] text-gray-800">
                円
              </span>
            </div>
          </div>
        </BaseCard>

        {/* 寄付件数カード */}
        <BaseCard className="w-60">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-6">
              <div className="text-gray-800 font-bold text-base">寄付件数</div>
              <div className="flex items-center gap-[2px]">
                <span className="text-[#238778] font-bold text-[13px]">
                  前日比
                </span>
                <Image
                  src="/icons/icon-arrow-up.svg"
                  alt="上向き矢印"
                  width={24}
                  height={24}
                  className="flex-shrink-0"
                />
                <span className="font-bold text-[#238778] text-base">
                  {donationCountChange}
                </span>
                <span className="text-[#238778] font-bold text-[13px]">件</span>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-bold text-[36px] leading-[30px] text-gray-800">
                {totalDonationDays}
              </span>
              <span className="font-bold text-base text-gray-800">件</span>
            </div>
          </div>
        </BaseCard>

        {/* 企業団体献金カード */}
        <BaseCard className="w-60">
          <div className="flex flex-col gap-4">
            <div className="text-gray-800 font-bold text-base">
              企業団体献金
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-[36px] leading-[30px] text-gray-800">
                0
              </span>
              <span className="font-bold text-base text-gray-800">件</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </>
  );
}
