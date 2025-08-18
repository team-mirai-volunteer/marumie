"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Transaction } from "@/shared/models/transaction";

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("ja-JP");
  };

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
                  種別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  借方勘定
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  貸方勘定
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  摘要
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.transaction_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.transaction_type === "income"
                          ? "bg-green-100 text-green-800"
                          : transaction.transaction_type === "expense"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {transaction.transaction_type === "income"
                        ? "収入"
                        : transaction.transaction_type === "expense"
                        ? "支出"
                        : "その他"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{transaction.debit_account}</div>
                    {transaction.debit_sub_account && (
                      <div className="text-xs text-gray-500">
                        {transaction.debit_sub_account}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{transaction.credit_account}</div>
                    {transaction.credit_sub_account && (
                      <div className="text-xs text-gray-500">
                        {transaction.credit_sub_account}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(transaction.debit_amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description || transaction.description_1 || "-"}
                  </td>
                </tr>
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