import "server-only";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import AboutSection from "@/client/components/common/AboutSection";
import ExplanationSection from "@/client/components/common/ExplanationSection";
import TransparencySection from "@/client/components/common/TransparencySection";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumn from "@/client/components/layout/MainColumn";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import InteractiveTransactionTable from "@/client/components/top-page/features/transactions-table/InteractiveTransactionTable";
import { loadTransactionsPageData } from "@/server/loaders/load-transactions-page-data";
import { loadOrganizations } from "@/server/loaders/load-organizations";
import { formatUpdatedAt } from "@/server/utils/format-date";

interface TransactionsPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { default: defaultSlug, organizations } = await loadOrganizations();
  const validSlug = organizations.some((org) => org.slug === slug)
    ? slug
    : defaultSlug;
  const slugs = [validSlug];

  // financialYearのデフォルト値を設定
  const currentFinancialYear = 2025;

  try {
    const result = await loadTransactionsPageData({
      slugs,
      page: 1,
      perPage: 1,
      financialYear: currentFinancialYear,
    });

    return {
      title: `みらいオープンデータ - すべての入出金（${result.politicalOrganizations[0]?.displayName || "Unknown"}）`,
      description: `${result.politicalOrganizations[0]?.displayName || "Unknown"}の政治資金取引一覧を表示しています。`,
    };
  } catch {
    return {
      title: "みらいオープンデータ - すべての入出金",
      description: "政治資金取引一覧を表示しています。",
    };
  }
}

export default async function TransactionsPage({
  params,
  searchParams,
}: TransactionsPageProps) {
  const { slug } = await params;

  // slugの妥当性をチェックし、必要に応じてリダイレクト
  const { default: defaultSlug, organizations } = await loadOrganizations();
  if (!organizations.some((org) => org.slug === slug)) {
    redirect(`/o/${defaultSlug}/transactions`);
  }

  const slugs = [slug];
  const searchParamsResolved = await searchParams;

  const page = parseInt(
    Array.isArray(searchParamsResolved.page)
      ? searchParamsResolved.page[0] || "1"
      : searchParamsResolved.page || "1",
    10,
  );
  const perPage = 50; // Fixed value

  const filterType = Array.isArray(searchParamsResolved.filterType)
    ? searchParamsResolved.filterType[0]
    : searchParamsResolved.filterType;

  const transactionType = filterType as "income" | "expense" | undefined;

  // sortBy: 'date' | 'amount' (read from 'sort' URL parameter)
  const sortBy = Array.isArray(searchParamsResolved.sort)
    ? searchParamsResolved.sort[0]
    : searchParamsResolved.sort;

  // order: 'asc' | 'desc'
  const order = Array.isArray(searchParamsResolved.order)
    ? searchParamsResolved.order[0]
    : searchParamsResolved.order;

  // categories: multiple category keys for filtering (comma-separated)
  const categories = searchParamsResolved.categories
    ? decodeURIComponent(String(searchParamsResolved.categories))
        .split(",")
        .filter(Boolean)
    : undefined;

  const financialYear = 2025; // 固定値

  try {
    const data = await loadTransactionsPageData({
      slugs,
      page,
      perPage,
      transactionType,
      financialYear,
      sortBy: sortBy as "date" | "amount" | undefined,
      order: order as "asc" | "desc" | undefined,
      categories,
    });

    const updatedAt = formatUpdatedAt(data.lastUpdatedAt ?? null);

    return (
      <MainColumn>
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
            updatedAt={updatedAt}
            subtitle="これまでにデータ連携された出入金の明細"
          />

          <InteractiveTransactionTable
            transactions={data.transactions}
            total={data.total}
            page={data.page}
            perPage={data.perPage}
            totalPages={data.totalPages}
            selectedCategories={categories}
          />
        </MainColumnCard>

        <TransparencySection title="党内の機密データの流出事故ではありません☺️" />

        <ExplanationSection />

        <AboutSection />
      </MainColumn>
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      notFound();
    }

    throw error;
  }
}
