import "server-only";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AboutSection from "@/client/components/common/AboutSection";
import LinkCardsSection from "@/client/components/common/LinkCardsSection";
import AnotherPageLinkSection from "@/client/components/common/AnotherPageLinkSection";
import ExplanationSection from "@/client/components/common/ExplanationSection";
import TransparencySection from "@/client/components/common/TransparencySection";
import MainColumn from "@/client/components/layout/MainColumn";
import BalanceSheetSection from "@/client/components/top-page/BalanceSheetSection";
import CashFlowSection from "@/client/components/top-page/CashFlowSection";
import MonthlyTrendsSection from "@/client/components/top-page/MonthlyTrendsSection";
import ProgressSection from "@/client/components/top-page/ProgressSection";
import TransactionsSection from "@/client/components/top-page/TransactionsSection";
import { loadTopPageData } from "@/server/contexts/public-finance/presentation/loaders/load-top-page-data";
import { loadOrganizations } from "@/server/contexts/public-finance/presentation/loaders/load-organizations";
import { formatUpdatedAt } from "@/client/lib/format-date";

export const revalidate = 300; // 5 minutes

interface OrgPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: OrgPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { organizations } = await loadOrganizations();
  const currentOrganization = organizations.find((org) => org.slug === slug);

  const title = currentOrganization?.displayName
    ? `${currentOrganization.displayName} - みらいまる見え運営資金`
    : "みらいまる見え運営資金";

  return {
    title,
  };
}

export default async function OrgPage({ params }: OrgPageProps) {
  const { slug } = await params;

  // slugの妥当性をチェックし、必要に応じてリダイレクト
  const { default: defaultSlug, organizations } = await loadOrganizations();
  if (!organizations.some((org) => org.slug === slug)) {
    redirect(`/o/${defaultSlug}`);
  }

  const slugs = [slug];

  // 現在のslugに対応する組織を取得
  const currentOrganization = organizations.find((org) => org.slug === slug);

  // 統合アクションで全データを取得
  const data = await loadTopPageData({
    slugs,
    page: 1,
    perPage: 6, // 表示用に6件のみ取得
    financialYear: 2025, // デフォルト値
  }).catch((error) => {
    console.error("loadTopPageData error:", error);
    return null;
  });

  const updatedAt = formatUpdatedAt(data?.transactionData?.lastUpdatedAt ?? null);

  return (
    <MainColumn>
      <CashFlowSection
        political={data?.political ?? null}
        friendly={data?.friendly ?? null}
        updatedAt={updatedAt}
        organizationName={currentOrganization?.displayName}
      />
      <MonthlyTrendsSection
        monthlyData={data?.monthlyData}
        updatedAt={updatedAt}
        organizationName={currentOrganization?.displayName}
      />
      <TransparencySection title="党首もこれを見て、お金をやりくりしています👀" />
      <BalanceSheetSection
        data={data?.balanceSheetData}
        updatedAt={updatedAt}
        organizationName={currentOrganization?.displayName}
      />
      <TransactionsSection
        transactionData={data?.transactionData ?? null}
        updatedAt={updatedAt}
        slug={slug}
        organizationName={currentOrganization?.displayName}
      />
      <AnotherPageLinkSection currentSlug={slug} />
      <ProgressSection />
      <ExplanationSection />
      <AboutSection />
      <LinkCardsSection />
    </MainColumn>
  );
}
