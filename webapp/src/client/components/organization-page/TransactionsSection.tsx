"use client";
import "client-only";
import Image from "next/image";
import Link from "next/link";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import TransactionTable from "@/client/components/organization-page/components/TransactionTable";
import MainButton from "@/client/components/ui/MainButton";

import type { DisplayTransaction } from "@/types/display-transaction";

interface TransactionData {
  transactions: DisplayTransaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface TransactionsSectionProps {
  transactionData: TransactionData | null;
  slug: string;
}

export default function TransactionsSection({
  transactionData,
  slug,
}: TransactionsSectionProps) {
  return (
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
              <Link href={`/${slug}/transactions`}>
                <MainButton>もっと見る</MainButton>
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
  );
}
