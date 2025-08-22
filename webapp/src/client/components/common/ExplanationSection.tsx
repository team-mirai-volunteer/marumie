import "server-only";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

export default function ExplanationSection() {
  return (
    <MainColumnCard id="explanation">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-3">
            みらいオープンデータについて
          </h3>
          <p className="text-[15px] leading-[1.87] text-[#1F2937]">
            本プロジェクトは、政治資金の透明化を目的としてチームみらい・永田町エンジニアチームによって開発されたオープンソースプログラムです。決済データは、クレジットカード、デビットカード、銀行口座と連携したマネーフォワードクラウドを通じて収集され、ほぼリアルタイムで反映されています。本プログラムは今後、オープンソースとして無償で公開し、他の政党や議員事務所を問わず利用可能な形で提供してまいります。
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-3">免責事項</h3>
          <p className="text-[15px] leading-[1.87] text-[#1F2937]">
            本プロジェクトで公開するデータは可能な限り正確かつ最新の情報を反映するよう努めていますが、その正確性・完全性・即時性について保証するものではありません。最終的な収支は、年度末に公開される「政治資金収支報告書」をご確認ください。また、本プロジェクトにおける公開対象は選挙資金を含まない政治資金に限られることにもご留意ください。
          </p>
        </div>
      </div>
    </MainColumnCard>
  );
}
