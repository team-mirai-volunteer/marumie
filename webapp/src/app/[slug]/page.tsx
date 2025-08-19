import "server-only";
import Image from "next/image";
import Link from "next/link";
import SankeyChart from "@/client/components/features/sankey/SankeyChart";
import TransactionTable from "@/client/components/features/transaction/TransactionTable";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumn from "@/client/components/layout/MainColumn";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import CardSummary from "@/client/components/ui/CardSummary";
import { getSankeyData } from "@/server/actions/get-sankey-data";
import { getTransactionsBySlugAction } from "@/server/actions/get-transactions-by-slug";
import type { SankeyData, SankeyLink } from "@/types/sankey";

// sankeyDataから財務データを計算する関数
function calculateFinancialData(sankeyData: SankeyData | null) {
  if (!sankeyData?.links) {
    return { income: 0, expense: 0, balance: 0 };
  }

  // 収入の計算（「合計」ノードへの流入）
  const income = sankeyData.links
    .filter((link: SankeyLink) => link.target === "合計")
    .reduce((sum: number, link: SankeyLink) => sum + link.value, 0);

  // 支出の計算（「合計」ノードからの流出、ただし「現残高」は除く）
  const expense = sankeyData.links
    .filter(
      (link: SankeyLink) => link.source === "合計" && link.target !== "現残高",
    )
    .reduce((sum: number, link: SankeyLink) => sum + link.value, 0);

  // 残高の計算（「現残高」への流出があればその値、なければ0）
  const balanceLink = sankeyData.links.find(
    (link: SankeyLink) => link.target === "現残高",
  );
  const balance = balanceLink ? balanceLink.value : 0;

  return { income, expense, balance };
}

// 金額を万円単位でフォーマットする関数
function formatAmount(amount: number) {
  const manAmount = Math.round(amount / 10000); // 万円に変換

  if (manAmount >= 10000) {
    const oku = Math.floor(manAmount / 10000);
    const man = manAmount % 10000;
    if (man === 0) {
      return {
        main: oku.toString(),
        secondary: "億",
        tertiary: "",
        unit: "円",
      };
    }
    return {
      main: oku.toString(),
      secondary: "億",
      tertiary: man.toString(),
      unit: "万円",
    };
  }
  return {
    main: manAmount.toString(),
    secondary: "",
    tertiary: "",
    unit: "万円",
  };
}

export default async function PoliticianPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // サーバーサイドでサンキーデータを取得
  const sankeyData = await getSankeyData({ slug });

  // 財務データを計算
  const financialData = calculateFinancialData(sankeyData);

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
              src="/cashflow.svg"
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
        <div className="flex items-center gap-6">
          <CardSummary className="flex-1">
            <div className="text-[#238778] font-bold text-base mb-4">収入</div>
            <div className="flex items-end gap-1">
              {(() => {
                const formatted = formatAmount(financialData.income);
                return (
                  <>
                    <span className="text-[#1F2937] font-bold text-[40px] leading-[30px]">
                      {formatted.main}
                    </span>
                    {formatted.secondary && (
                      <span className="text-[#1F2937] font-bold text-base">
                        {formatted.secondary}
                      </span>
                    )}
                    {formatted.tertiary && (
                      <span className="text-[#1F2937] font-bold text-[40px] leading-[30px]">
                        {formatted.tertiary}
                      </span>
                    )}
                    <span className="text-[#1F2937] font-bold text-base">
                      {formatted.unit}
                    </span>
                  </>
                );
              })()}
            </div>
          </CardSummary>

          <CardSummary className="flex-1">
            <div className="text-[#DC2626] font-bold text-base mb-4">支出</div>
            <div className="flex items-end gap-1">
              {(() => {
                const formatted = formatAmount(financialData.expense);
                return (
                  <>
                    <span className="text-[#1F2937] font-bold text-[40px] leading-[30px]">
                      {formatted.main}
                    </span>
                    {formatted.secondary && (
                      <span className="text-[#1F2937] font-bold text-base">
                        {formatted.secondary}
                      </span>
                    )}
                    {formatted.tertiary && (
                      <span className="text-[#1F2937] font-bold text-[40px] leading-[30px]">
                        {formatted.tertiary}
                      </span>
                    )}
                    <span className="text-[#1F2937] font-bold text-base">
                      {formatted.unit}
                    </span>
                  </>
                );
              })()}
            </div>
          </CardSummary>

          <CardSummary className="flex-1">
            <div className="text-[#000000] font-bold text-base mb-4">
              現在の残高
            </div>
            <div className="flex items-end gap-1">
              {(() => {
                const formatted = formatAmount(financialData.balance);
                return (
                  <>
                    <span className="text-[#000000] font-bold text-[40px] leading-[30px]">
                      {formatted.main}
                    </span>
                    {formatted.secondary && (
                      <span className="text-[#000000] font-bold text-base">
                        {formatted.secondary}
                      </span>
                    )}
                    {formatted.tertiary && (
                      <span className="text-[#000000] font-bold text-[40px] leading-[30px]">
                        {formatted.tertiary}
                      </span>
                    )}
                    <span className="text-[#000000] font-bold text-base">
                      {formatted.unit}
                    </span>
                  </>
                );
              })()}
            </div>
          </CardSummary>
        </div>

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
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <title>Bar chart icon</title>
              <rect x="3.75" y="3.75" width="22.5" height="22.5" stroke="#2AA693" strokeWidth="2" fill="none"/>
              <line x1="22.5" y1="11.25" x2="22.5" y2="21.25" stroke="#2AA693" strokeWidth="2"/>
              <line x1="16.25" y1="6.25" x2="16.25" y2="21.25" stroke="#2AA693" strokeWidth="2"/>
              <line x1="10" y1="17.5" x2="10" y2="21.25" stroke="#2AA693" strokeWidth="2"/>
            </svg>
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
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <title>Heart handshake icon</title>
              <path d="M2.49 3.74h25.02v22.51H2.49z" stroke="#2AA693" strokeWidth="2" fill="none"/>
              <path d="M10.32 6.7h15.62v8.45H10.32z" stroke="#2AA693" strokeWidth="2" fill="none"/>
              <circle cx="21.25" cy="17.5" r="1.25" fill="#2AA693"/>
              <circle cx="17.5" cy="21.25" r="1.25" fill="#2AA693"/>
            </svg>
          }
          title="これまでの累計寄付金額"
          updatedAt="2025.8.14時点"
          subtitle="チームみらいにいただいた寄付金額と1ヶ月の推移"
        />

        {/* 寄付統計サマリー */}
        <div className="flex items-center gap-6">
          <CardSummary className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[#000000] font-bold text-base">寄付金額</div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-[#6B7280]">前日比</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <title>Arrow up icon</title>
                  <path d="M12 5l7 7-7 7" stroke="#238778" strokeWidth="2" fill="none"/>
                  <path d="M5 5l7 7" stroke="#238778" strokeWidth="2" fill="none"/>
                </svg>
                <span className="text-[#238778] font-bold">8,000</span>
                <span className="text-[#6B7280]">円</span>
              </div>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-[#000000] font-bold text-[40px] leading-[30px]">1</span>
              <span className="text-[#000000] font-bold text-base">億</span>
              <span className="text-[#000000] font-bold text-[40px] leading-[30px]">7462</span>
              <span className="text-[#000000] font-bold text-base">万</span>
              <span className="text-[#000000] font-bold text-[40px] leading-[30px]">4000</span>
              <span className="text-[#000000] font-bold text-base">円</span>
            </div>
          </CardSummary>

          <CardSummary className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[#000000] font-bold text-base">寄付件数</div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-[#6B7280]">前日比</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <title>Arrow up icon</title>
                  <path d="M12 5l7 7-7 7" stroke="#238778" strokeWidth="2" fill="none"/>
                  <path d="M5 5l7 7" stroke="#238778" strokeWidth="2" fill="none"/>
                </svg>
                <span className="text-[#238778] font-bold">12</span>
                <span className="text-[#6B7280]">件</span>
              </div>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-[#000000] font-bold text-[40px] leading-[30px]">7118</span>
              <span className="text-[#000000] font-bold text-base">件</span>
            </div>
          </CardSummary>

          <CardSummary className="flex-1">
            <div className="text-[#000000] font-bold text-base mb-4">企業団体献金</div>
            <div className="flex items-end gap-1">
              <span className="text-[#000000] font-bold text-[40px] leading-[30px]">0</span>
              <span className="text-[#000000] font-bold text-base">件</span>
            </div>
          </CardSummary>
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
          <button type="button" className="bg-gradient-to-r from-[#BCECD3] to-[#64D8C6] border border-black rounded-[40px] px-6 py-2 text-[#000000] font-bold text-base hover:opacity-90 transition-opacity">
            ご寄付はこちら
          </button>
        </div>
      </MainColumnCard>

      {/* セクション4: すべての出入金 */}
      <MainColumnCard>
        <CardHeader
          icon={
            <svg width="29" height="30" viewBox="0 0 29 30" fill="none">
              <title>Cash move icon</title>
              <path d="M3.63 6.25h22.96v21.25H3.63z" stroke="#2AA693" strokeWidth="2" fill="none"/>
              <path d="M4.83 5h16.92v12.5H4.83z" stroke="#2AA693" strokeWidth="2" fill="none"/>
              <path d="M10.88 8.75h12.08v12.5H10.88z" stroke="#2AA693" strokeWidth="2" fill="none"/>
            </svg>
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
        <div className="bg-white rounded-[21.68px] p-12 space-y-9">
          <div className="text-center">
            <h2 className="text-[34px] font-bold leading-[1.5] text-[#1F2937] mb-4">
              党首も毎日これを見て、お金をやりくりしています🤔
            </h2>
            <p className="text-base font-bold leading-[1.75] text-[#1F2937]">
              チームみらいのお金の流れは、ほぼリアルタイムにすべてここに反映されています。
              私たちがなぜここまでオープンにするのか、その理由はこちらのnoteをお読みください。
            </p>
          </div>

          <div className="space-y-9">
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
                マネーフォワード クラウド・XXX銀行・マネーフォワード クラウド・XXX銀行・
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
