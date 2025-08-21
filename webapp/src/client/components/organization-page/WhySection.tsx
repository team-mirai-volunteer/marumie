import "server-only";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

export default function WhySection() {
  return (
    <MainColumnCard className="rounded-[21.68px]">
      <div className="flex items-center self-stretch gap-[163.99px]">
        <div className="flex flex-col justify-center gap-[10.84px]">
          <div className="flex gap-[32.53px]">
            <h2 className="text-[34px] font-bold leading-[1.5] text-[#1F2937] font-japanese">
              党首も毎日これを見て、お金をやりくりしています🤔
            </h2>
          </div>
          <p className="text-base font-normal leading-[1.75] text-[#1F2937] w-[874.14px] font-japanese">
            チームみらいのお金の流れは、ほぼリアルタイムにすべてここに反映されています。
            <br />
            私たちがなぜここまでオープンにするのか、その理由はこちらのnoteをお読みください。
          </p>
        </div>
      </div>
    </MainColumnCard>
  );
}
