import "server-only";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

export default function ExplanationSection() {
  return (
    <MainColumnCard id="explanation">
      <div className="space-y-9">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 font-japanese">
            みらい まる見え政治資金について
          </h3>
          <p className="text-[15px] leading-[1.87] tracking-[0.01em] text-gray-800 font-japanese">
            本プロジェクトは、チームみらいによって政治資金の透明化を目的に開発されたオープンソースソフトウェアです。決済データは、クレジットカード、デビットカード、銀行口座を通じて収集され、現在はおおよそ週次で更新されています。すでにオープンソースで
            <a
              href="https://github.com/team-mirai-volunteer/open"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#238778] underline hover:no-underline"
            >
              こちらのGitHub
            </a>
            にて無償公開中であり、政党や所属を問わず利用可能な形で提供しております。開発コミュニティにご興味のある方は
            <a
              href="/#"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#238778] underline hover:no-underline"
            >
              こちらのSlack
            </a>
            をご覧ください。
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 font-japanese">
            データ
          </h3>
          <div className="text-[15px] leading-[1.87] tracking-[0.01em] text-gray-800 font-japanese">
            「チームみらい」と「デジ民（安野個人政治団体）」
            <br />
            2025年5月以降のデータが反映されている
            <br />
            「政治資金」と「選挙資金」が両方含まれていることを明記したほうがよさそう
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 font-japanese">
            免責事項
          </h3>
          <p className="text-[15px] leading-[1.87] tracking-[0.01em] text-gray-800 font-japanese">
            本サイトで公開するデータは、可能な限り正確かつ最新の情報を反映するよう努めていますが、現時点においてはその正確性・完全性・即時性について保証するものではありません。最終的な収支は、別途公開される「政治資金収支報告書」をご確認ください。また、現時点では政党「チームみらい」の収支であり、安野たかひろや他の候補者の政治資金は含んでおりません。今後追って公開してまいります。
          </p>
        </div>
      </div>
    </MainColumnCard>
  );
}
