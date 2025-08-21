import "server-only";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

export default function WhySection() {
  return (
    <MainColumnCard className="rounded-2xl sm:rounded-[21.68px] !px-[18px] sm:!px-6 !py-6 sm:!py-6">
      <div className="flex items-center self-stretch">
        <div className="flex flex-col justify-center gap-2 sm:gap-[10.84px]">
          <div className="flex">
            <h2 className="text-xl sm:text-[34px] font-bold leading-[1.5] tracking-[0.01em] text-[#1F2937] font-japanese">
              党首も毎日これを見て、お金をやりくりしています🤔
            </h2>
          </div>
          <p className="text-xs sm:text-base font-medium sm:font-normal leading-[1.667] sm:leading-[1.75] tracking-[0.01em] text-[#6B7280] sm:text-[#1F2937] font-japanese">
            チームみらいのお金の流れは、ほぼリアルタイムにすべてここに反映されています。
            <span className="hidden sm:inline">
              <br />
            </span>
            私たちがなぜここまでオープンにするのか、その理由はこちらのnoteをお読みください。
          </p>
        </div>
      </div>
    </MainColumnCard>
  );
}
