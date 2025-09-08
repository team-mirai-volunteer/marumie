import "server-only";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

export default function ExplanationSection() {
  return (
    <MainColumnCard id="explanation">
      <div className="space-y-9">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 font-japanese">
            みらい まる見え政治資金について
          </h3>
          <p className="text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium font-japanese">
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
              href="https://join.slack.com/t/team-mirai-volunteer/shared_invite/zt-3dap6i768-1nztzb2S2SNDLX8DzzJ9Hg"
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
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 font-japanese">
            データの出典
          </h3>
          <p className="text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium font-japanese">
            本サイトに含まれる政治資金収支データは、政党「チームみらい」並びに党首・安野貴博の政治団体である「デジタル民主主義を考える会」の収支を合算したもので、結党した2025年5月以降の仕訳けが完了した収支を掲載しています。なお収支データには、政治資金規制法で定義された政治活動に使うお金である「政治資金」と、公職選挙法で定義された選挙運動に使うお金である「選挙資金」の双方が含まれています。
          </p>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 font-japanese">
            免責事項
          </h3>
          <p className="text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium font-japanese">
            本サイトで公開するデータは、可能な限り正確かつ最新の情報を反映するよう努めていますが、現時点においてはその正確性・完全性・即時性について保証するものではありません。今後は、これらの側面について一層踏み込んだ公開を目指してまいります。現時点での最終的な収支は、別途公開される「政治資金収支報告書」並びに「選挙運動費用収支報告書」をご確認ください。
          </p>
        </div>
      </div>
    </MainColumnCard>
  );
}
