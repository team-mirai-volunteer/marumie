"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Transaction } from "@/shared/models/transaction";
import type { PoliticalOrganization } from "@/shared/models/political-organization";

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  politicalOrganization: PoliticalOrganization;
}

export default function TransactionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  
  const [data, setData] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "50", 10);
  const transactionType = searchParams.get("transactionType");
  const financialYear = searchParams.get("financialYear");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = new URL(`/api/p/${slug}/transactions`, window.location.origin);
        url.searchParams.set("page", currentPage.toString());
        url.searchParams.set("perPage", perPage.toString());
        
        if (transactionType) {
          url.searchParams.set("transactionType", transactionType);
        }
        if (financialYear) {
          url.searchParams.set("financialYear", financialYear);
        }

        const response = await fetch(url.toString());
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch transactions");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [slug, currentPage, perPage, transactionType, financialYear]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ja-JP");
  };

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `/${slug}/transactions?${params.toString()}`;
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="text-red-600">
          <h1 className="text-2xl font-semibold mb-4">エラー</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="p-6">
        <div>データが見つかりません</div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/${slug}`} className="text-blue-600 hover:underline">
          ← {data.politicalOrganization.name}
        </Link>
      </div>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          取引一覧 - {data.politicalOrganization.name}
        </h1>
        <div className="text-sm text-gray-600">
          {data.total}件中 {(data.page - 1) * data.perPage + 1}-
          {Math.min(data.page * data.perPage, data.total)}件を表示
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
              {data.transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.transaction_date.toString())}
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

      {data.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            ページ {data.page} / {data.totalPages}
          </div>
          <div className="flex space-x-2">
            {data.page > 1 && (
              <Link
                href={buildPageUrl(data.page - 1)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                前へ
              </Link>
            )}
            {data.page < data.totalPages && (
              <Link
                href={buildPageUrl(data.page + 1)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                次へ
              </Link>
            )}
          </div>
        </div>
      )}
    </main>
  );
}