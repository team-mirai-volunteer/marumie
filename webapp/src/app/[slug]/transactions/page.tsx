import "server-only";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumn from "@/client/components/layout/MainColumn";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import TransactionTableWrapper from "@/client/components/organization-page/components/TransactionTableWrapper";
import { getTransactionsBySlugAction } from "@/server/actions/get-transactions-by-slug";

interface TransactionsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: TransactionsPageProps): Promise<Metadata> {
  const { slug } = await params;

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
      title: `取引一覧 - ${result.politicalOrganization.name}`,
      description: `${result.politicalOrganization.name}の政治資金取引一覧を表示しています。`,
    };
  } catch {
    return {
      title: "取引一覧",
      description: "政治資金取引一覧を表示しています。",
    };
  }
}

export default async function TransactionsPage({
  params,
  searchParams,
}: TransactionsPageProps) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;

  const page = parseInt(
    Array.isArray(searchParamsResolved.page)
      ? searchParamsResolved.page[0] || "1"
      : searchParamsResolved.page || "1",
    10,
  );
  const perPage = parseInt(
    Array.isArray(searchParamsResolved.perPage)
      ? searchParamsResolved.perPage[0] || "50"
      : searchParamsResolved.perPage || "50",
    10,
  );

  const transactionType = Array.isArray(searchParamsResolved.transactionType)
    ? searchParamsResolved.transactionType[0]
    : searchParamsResolved.transactionType;

  const financialYear = 2025; // 固定値

  try {
    const data = await getTransactionsBySlugAction({
      slug,
      page,
      perPage,
      transactionType: transactionType as
        | "income"
        | "expense"
        | "other"
        | undefined,
      financialYear,
    });

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
            updatedAt="2025.8.19時点"
            subtitle="どこから政治資金を得て、何に使っているのか"
          />

          <TransactionTableWrapper
            transactions={data.transactions}
            total={data.total}
            page={data.page}
            perPage={data.perPage}
            totalPages={data.totalPages}
          />
        </MainColumnCard>
      </MainColumn>
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      notFound();
    }

    throw error;
  }
}
