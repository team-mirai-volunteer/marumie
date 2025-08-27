import "server-only";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ExplanationSection from "@/client/components/common/ExplanationSection";
import TransparencySection from "@/client/components/common/TransparencySection";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumn from "@/client/components/layout/MainColumn";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import InteractiveTransactionTable from "@/client/components/top-page/features/transactions-table/InteractiveTransactionTable";
import { getTransactionsBySlugAction } from "@/server/actions/get-transactions-by-slug";
import { formatUpdatedAt } from "@/server/utils/format-date";

interface TransactionsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const slug = "team-mirai";

  // financialYearのデフォルト値を設定
  const currentFinancialYear = 2025;

  try {
    const result = await getTransactionsBySlugAction({
      slug,
      page: 1,
      perPage: 1,
      financialYear: currentFinancialYear,
    });

    return {
      title: `みらいオープンデータ - すべての入出金（${result.politicalOrganization.name}）`,
      description: `${result.politicalOrganization.name}の政治資金取引一覧を表示しています。`,
    };
  } catch {
    return {
      title: "みらいオープンデータ - すべての入出金",
      description: "政治資金取引一覧を表示しています。",
    };
  }
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const slug = "team-mirai";
  const searchParamsResolved = await searchParams;

  const page = parseInt(
    Array.isArray(searchParamsResolved.page)
      ? searchParamsResolved.page[0] || "1"
      : searchParamsResolved.page || "1",
    10,
  );
  const perPage = 20; // Fixed value

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

  // filter: categoryName
  const categoryName = Array.isArray(searchParamsResolved.categoryName)
    ? searchParamsResolved.categoryName[0]
    : searchParamsResolved.categoryName;

  const financialYear = 2025; // 固定値

  try {
    const data = await getTransactionsBySlugAction({
      slug,
      page,
      perPage,
      transactionType,
      financialYear,
      sortBy: sortBy as "date" | "amount" | undefined,
      order: order as "asc" | "desc" | undefined,
      categoryName: categoryName || undefined,
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
            subtitle="どこから政治資金を得て、何に使っているのか"
          />

          <InteractiveTransactionTable
            transactions={data.transactions}
            total={data.total}
            page={data.page}
            perPage={data.perPage}
            totalPages={data.totalPages}
          />
        </MainColumnCard>

        <TransparencySection title="党内の機密データの流出事故ではありません☺️" />

        <ExplanationSection />
      </MainColumn>
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      notFound();
    }

    throw error;
  }
}
