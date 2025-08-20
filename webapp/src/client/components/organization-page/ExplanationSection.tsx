import "server-only";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

export default function ExplanationSection() {
  return (
    <MainColumnCard>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-3">
            Mirai Open Dataについて
          </h3>
          <p className="text-[15px] leading-[1.87] text-[#1F2937]">
            テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-3">
            本ページに記載されている収支のデータソース
          </h3>
          <p className="text-[15px] leading-[1.87] text-[#1F2937]">
            マネーフォワード クラウド・XXX銀行・マネーフォワード
            クラウド・XXX銀行・
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-3">免責事項</h3>
          <p className="text-[15px] leading-[1.87] text-[#1F2937]">
            本ページに記載されているデータは収支報告書と異なる場合があるよ。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
          </p>
        </div>
      </div>
    </MainColumnCard>
  );
}
