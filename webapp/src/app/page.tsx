import "server-only";
import ExplanationSection from "@/client/components/common/ExplanationSection";
import TransparencySection from "@/client/components/common/TransparencySection";
import MainColumn from "@/client/components/layout/MainColumn";
import CashFlowSection from "@/client/components/top-page/CashFlowSection";
import DonationSummarySection from "@/client/components/top-page/DonationSummarySection";
import MonthlyTrendsSection from "@/client/components/top-page/MonthlyTrendsSection";
import TransactionsSection from "@/client/components/top-page/TransactionsSection";
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
      <TransparencySection title="党首も毎日これを見て、お金をやりくりしています🤔" />
      <TransactionsSection transactionData={data?.transactionData ?? null} />
      <ExplanationSection />
    </MainColumn>
  );
}
