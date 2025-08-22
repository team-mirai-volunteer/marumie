import "server-only";
import MainColumn from "@/client/components/layout/MainColumn";
import CashFlowSection from "@/client/components/organization-page/CashFlowSection";
import DonationSummarySection from "@/client/components/organization-page/DonationSummarySection";
import ExplanationSection from "@/client/components/organization-page/ExplanationSection";
import MonthlyTrendsSection from "@/client/components/organization-page/MonthlyTrendsSection";
import TransactionsSection from "@/client/components/organization-page/TransactionsSection";
import WhySection from "@/client/components/organization-page/WhySection";
import { getTransactionPageDataAction } from "@/server/actions/get-transaction-page-data";

export const revalidate = 300; // 5 minutes

export default async function Home() {
  const slug = "team-mirai";

  // 統合アクションで全データを取得
  const data = await getTransactionPageDataAction({
    slug,
    page: 1,
    perPage: 6, // 表示用に7件のみ取得
    financialYear: 2025, // デフォルト値
  }).catch(() => null);

  return (
    <MainColumn>
      <CashFlowSection sankeyData={data?.sankeyData ?? null} />
      <MonthlyTrendsSection monthlyData={data?.monthlyData} />
      <DonationSummarySection donationSummary={data?.donationSummary} />
      <WhySection />
      <TransactionsSection transactionData={data?.transactionData ?? null} />
      <ExplanationSection />
    </MainColumn>
  );
}
