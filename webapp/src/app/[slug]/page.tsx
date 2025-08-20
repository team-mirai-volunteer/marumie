import "server-only";
import MainColumn from "@/client/components/layout/MainColumn";
import CashFlowSection from "@/client/components/organization-page/CashFlowSection";
import DonationSummarySection from "@/client/components/organization-page/DonationSummarySection";
import ExplanationSection from "@/client/components/organization-page/ExplanationSection";
import MonthlyTrendsSection from "@/client/components/organization-page/MonthlyTrendsSection";
import TransactionsSection from "@/client/components/organization-page/TransactionsSection";
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
      <CashFlowSection sankeyData={sankeyData} />
      <MonthlyTrendsSection />
      <DonationSummarySection />
      <TransactionsSection transactionData={transactionData} slug={slug} />
      <ExplanationSection />
    </MainColumn>
  );
}
