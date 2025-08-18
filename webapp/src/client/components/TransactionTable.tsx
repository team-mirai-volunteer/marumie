"use client";
import "client-only";

import { useRouter, useSearchParams } from "next/navigation";
import type { Transaction } from "@/shared/models/transaction";
import TransactionTableRow from "./TransactionTableRow";

interface TransactionTableProps {
  transactions: Transaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  slug: string;
}

export default function TransactionTable({
  transactions,
  total,
  page,
  perPage,
  totalPages,
  slug,
}: TransactionTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    return `/${slug}/transactions?${params.toString()}`;
  };

  const handlePageChange = (newPage: number) => {
    const url = buildPageUrl(newPage);
    router.push(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {total}件中 {(page - 1) * perPage + 1}-
          {Math.min(page * perPage, total)}件を表示
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  取引日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  収入項目
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  会計科目
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <TransactionTableRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            ページ {page} / {totalPages}
          </div>
          <div className="flex space-x-2">
            {page > 1 && (
              <button
                onClick={() => handlePageChange(page - 1)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                前へ
              </button>
            )}
            {page < totalPages && (
              <button
                onClick={() => handlePageChange(page + 1)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                次へ
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
