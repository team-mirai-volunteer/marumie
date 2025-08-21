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
}

export default function TransactionsSection({
  transactionData,
}: TransactionsSectionProps) {
  return (
    <MainColumnCard id="transactions">
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
        subtitle="今年のすべての出入金のリスト"
      />

      {transactionData ? (
        <div className="relative">
          <TransactionTable
            transactions={transactionData.transactions}
            total={transactionData.total}
            page={transactionData.page}
            perPage={transactionData.perPage}
          />

          {/* グラデーションオーバーレイ - テーブルの一番下の部分にかかる */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/70 to-transparent">
            {/* もっと見るボタン - グラデーション内に配置 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Link href="/transactions">
                <MainButton>もっと見る</MainButton>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">
          取引データが取得できませんでした
        </div>
      )}
    </MainColumnCard>
  );
}
