import "server-only";
import Image from "next/image";
import Link from "next/link";
import SankeyChart from "@/client/components/features/sankey/SankeyChart";
import ComplexDonationSummaryCard from "@/client/components/features/summary/ComplexDonationSummaryCard";
import DonationSummaryCard from "@/client/components/features/summary/DonationSummaryCard";
import FinancialSummarySection from "@/client/components/features/summary/FinancialSummarySection";
import TransactionTable from "@/client/components/features/transaction/TransactionTable";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumn from "@/client/components/layout/MainColumn";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import { getSankeyData } from "@/server/actions/get-sankey-data";
import { getTransactionsBySlugAction } from "@/server/actions/get-transactions-by-slug";

export default async function PoliticianPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // サーバーサイドでサンキーデータを取得
  const sankeyData = await getSankeyData({ slug });

  // トランザクションデータを取得（最初の数件のみ）
  const transactionData = await getTransactionsBySlugAction({
    slug,
    page: 1,
    perPage: 7, // 表示用に7件のみ取得
  }).catch(() => null);

  return (
    <MainColumn>
      {/* セクション1: チームみらいの収支の流れ */}
      <MainColumnCard>
        <CardHeader
          icon={
            <Image
              src="/icons/icon-cashflow.svg"
              alt="Cash flow icon"
              width={30}
              height={31}
            />
          }
          title="チームみらいの収支の流れ"
          updatedAt="2025.8.14時点"
          subtitle="チームみらいはどこからお金を得て、何に使っているのか"
        />

        {/* 財務サマリー */}
        <FinancialSummarySection sankeyData={sankeyData} />

        {sankeyData ? (
          <SankeyChart data={sankeyData} />
        ) : (
          <div className="text-gray-500">
            サンキー図データが取得できませんでした
          </div>
        )}
      </MainColumnCard>

      {/* セクション2: １年間の収支の推移 */}
      <MainColumnCard>
        <CardHeader
          icon={
            <Image
              src="/icons/icon-barchart.svg"
              alt="Bar chart icon"
              width={30}
              height={30}
            />
          }
          title="１年間の収支の推移"
          updatedAt="2025.8.14時点"
          subtitle="チームみらいは毎月いくらの収入と支出があるか"
        />

        {/* プレースホルダーグラフ */}
        <div className="h-[462px] bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-lg font-medium mb-2">月次収支推移グラフ</div>
            <div className="text-sm">実装予定</div>
          </div>
        </div>
      </MainColumnCard>

      {/* セクション3: これまでの累計寄付金額 */}
      <MainColumnCard>
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
          subtitle="チームみらいにいただいた寄付金額と1ヶ月の推移"
        />

        {/* 寄付統計サマリー */}
        <div className="flex items-center gap-6">
          <ComplexDonationSummaryCard
            className="flex-1"
            title="寄付金額"
            mainValue="1"
            mainUnit="億"
            secondaryValue="7462"
            secondaryUnit="万"
            tertiaryValue="4000"
            finalUnit="円"
            previousDayChange={{
              value: "8,000",
              unit: "円",
            }}
          />

          <DonationSummaryCard
            className="flex-1"
            title="寄付件数"
            value="7118"
            unit="件"
            previousDayChange={{
              value: "12",
              unit: "件",
            }}
          />

          <DonationSummaryCard
            className="flex-1"
            title="企業団体献金"
            value="0"
            unit="件"
          />
        </div>

        {/* プレースホルダーグラフ */}
        <div className="h-[287px] bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-lg font-medium mb-2">寄付金額推移グラフ</div>
            <div className="text-sm">実装予定</div>
          </div>
        </div>

        {/* 寄付メッセージとボタン */}
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-[#000000] font-bold text-base mb-6">
            チームみらいは、皆さまのご支援・ご寄付のおかげで活動を続けられております。
          </p>
          <button
            type="button"
            className="bg-gradient-to-r from-[#BCECD3] to-[#64D8C6] border border-black rounded-[40px] px-6 py-2 text-[#000000] font-bold text-base hover:opacity-90 transition-opacity"
          >
            ご寄付はこちら
          </button>
        </div>
      </MainColumnCard>

      {/* セクション4: すべての出入金 */}
      <MainColumnCard>
        <CardHeader
          icon={
            <Image
              src="/icons/icon-cashback.svg"
              alt="Cash move icon"
              width={30}
              height={30}
            />
          }
          title="すべての出入金"
          updatedAt="2025.8.14時点"
          subtitle="どこから政治資金を得て、何に使っているか"
        />

        {transactionData ? (
          <>
            <TransactionTable
              transactions={transactionData.transactions}
              total={transactionData.total}
              page={transactionData.page}
              perPage={transactionData.perPage}
              totalPages={transactionData.totalPages}
              slug={slug}
            />

            {/* もっと見るボタン */}
            <div className="relative">
              {/* グラデーションオーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" />

              <div className="flex justify-center pt-8">
                <Link
                  href={`/${slug}/transactions`}
                  className="bg-gradient-to-r from-[#BCECD3] to-[#64D8C6] border border-black rounded-[40px] px-6 py-2 text-[#000000] font-bold text-base hover:opacity-90 transition-opacity"
                >
                  もっと見る
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center py-8">
            取引データが取得できませんでした
          </div>
        )}
      </MainColumnCard>

      {/* セクション5: 説明セクション */}
      <MainColumnCard>
        <div className="bg-white rounded-[21.68px] p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-[34px] font-bold leading-[1.5] text-[#1F2937] mb-4">
              党首も毎日これを見て、お金をやりくりしています🤔
            </h2>
            <p className="text-base font-bold leading-[1.75] text-[#1F2937]">
              チームみらいのお金の流れは、ほぼリアルタイムにすべてここに反映されています。
              私たちがなぜここまでオープンにするのか、その理由はこちらのnoteをお読みください。
            </p>
          </div>

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
              <h3 className="text-lg font-bold text-[#1F2937] mb-3">
                免責事項
              </h3>
              <p className="text-[15px] leading-[1.87] text-[#1F2937]">
                本ページに記載されているデータは収支報告書と異なる場合があるよ。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
              </p>
            </div>
          </div>
        </div>
      </MainColumnCard>
    </MainColumn>
  );
}
