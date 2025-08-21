import "server-only";
import Image from "next/image";
import BaseCard from "@/client/components/ui/BaseCard";

interface DonationAmountCardProps {
  totalOku: number;
  totalMan: number;
  totalEn: number;
  dayOverDayChange: number;
}

export default function DonationAmountCard({
  totalOku,
  totalMan,
  totalEn,
  dayOverDayChange,
}: DonationAmountCardProps) {
  return (
    <BaseCard className="flex-1 p-4 md:p-6">
      {/* SP レイアウト */}
      <div className="flex md:hidden flex-row justify-between items-center">
        <div className="text-[#4B5563] font-bold text-sm">寄付金額</div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-baseline gap-[2px]">
            {totalOku > 0 && (
              <>
                <span className="font-bold text-2xl leading-5 text-[#1F2937]">
                  {totalOku}
                </span>
                <span className="font-bold text-xs text-[#6B7280]">億</span>
              </>
            )}
            {totalMan > 0 && (
              <>
                <span className="font-bold text-2xl leading-5 text-[#1F2937]">
                  {totalMan}
                </span>
                <span className="font-bold text-xs text-[#6B7280]">万</span>
              </>
            )}
            <span className="font-bold text-2xl leading-5 text-[#1F2937]">
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
      {/* PC レイアウト */}
      <div className="hidden md:flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="text-[#1F2937] font-bold text-base">累計寄付金額</div>
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
      </div>
    </BaseCard>
  );
}
