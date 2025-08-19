import "server-only";
import Image from "next/image";
import SankeyChart from "@/client/components/features/sankey/SankeyChart";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumn from "@/client/components/layout/MainColumn";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import CardSummary from "@/client/components/ui/CardSummary";
import { getSankeyData } from "@/server/actions/get-sankey-data";
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

  return (
    <MainColumn>
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
    </MainColumn>
  );
}
