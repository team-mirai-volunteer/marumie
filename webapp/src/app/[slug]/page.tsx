import "server-only";
import MainColumn from "@/client/components/layout/MainColumn";
import CashFlowSection from "@/client/components/organization-page/CashFlowSection";
import DonationSummarySection from "@/client/components/organization-page/DonationSummarySection";
import ExplanationSection from "@/client/components/organization-page/ExplanationSection";
import MonthlyTrendsSection from "@/client/components/organization-page/MonthlyTrendsSection";
import TransactionsSection from "@/client/components/organization-page/TransactionsSection";
import { getTransactionPageDataAction } from "@/server/actions/get-transaction-page-data";

export default async function PoliticianPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 統合アクションで全データを取得
  const data = await getTransactionPageDataAction({
    slug,
    page: 1,
    perPage: 7, // 表示用に7件のみ取得
    financialYear: new Date().getFullYear(), // デフォルト値
  }).catch(() => null);

  return (
    <MainColumn>
      <CashFlowSection sankeyData={data?.sankeyData} />
      <MonthlyTrendsSection monthlyData={data?.monthlyData} />
      <DonationSummarySection />
      <TransactionsSection
        transactionData={data?.transactionData}
        slug={slug}
      />
      <ExplanationSection />
    </MainColumn>
  );
}
