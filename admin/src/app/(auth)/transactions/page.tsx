"use client";
import "client-only";

import { useEffect, useState } from "react";
import {
  apiClient,
  type TransactionListResponse,
} from "@/client/clients/api-client";

export default function TransactionsPage() {
  const [data, setData] = useState<TransactionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const perPage = 50;

  useEffect(() => {
    const fetchTransactions = async (page: number) => {
      try {
        setLoading(true);
        const result = await apiClient.getTransactions({
          page,
          perPage,
        });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions(currentPage);
  }, [currentPage]);

  const fetchTransactions = async (page: number) => {
    try {
      setLoading(true);
      const result = await apiClient.getTransactions({
        page,
        perPage,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && data && page <= data.totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ja-JP");
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount);
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "income":
        return "収入";
      case "expense":
        return "支出";
      case "other":
        return "その他";
      default:
        return type;
    }
  };

  const handleDeleteAll = async () => {
    if (
      !window.confirm(
        "すべてのトランザクションを削除してもよろしいですか？この操作は取り消せません。",
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      const result = await apiClient.deleteAllTransactions();

      alert(`${result.deletedCount}件のトランザクションを削除しました。`);

      await fetchTransactions(1);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-primary-panel rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">取引一覧</h1>
        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={deleting || loading || !data || data.total === 0}
          className={`bg-red-600 text-white border-0 rounded-lg px-4 py-2.5 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ${
            deleting || loading || !data || data.total === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-red-700 cursor-pointer"
          }`}
        >
          {deleting ? "削除中..." : "全件削除"}
        </button>
      </div>

      {loading && <p className="text-primary-muted">読み込み中...</p>}

      {error && (
        <div className="text-red-500 mt-4 p-3 bg-red-900/20 rounded-lg border border-red-900/30">
          エラー: {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="mt-5 mb-4">
            <p className="text-primary-muted">
              全 {data.total} 件中 {(data.page - 1) * data.perPage + 1} -{" "}
              {Math.min(data.page * data.perPage, data.total)} 件を表示
            </p>
          </div>

          {data.transactions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-primary-muted">
                トランザクションが登録されていません
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-primary-border">
                      <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                        取引日
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                        種別
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                        借方
                      </th>
                      <th className="px-2 py-3 text-right text-sm font-semibold text-white">
                        借方金額
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                        貸方
                      </th>
                      <th className="px-2 py-3 text-right text-sm font-semibold text-white">
                        貸方金額
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                        摘要
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-primary-border"
                      >
                        <td className="px-2 py-3 text-sm text-white">
                          {formatDate(transaction.transaction_date)}
                        </td>
                        <td className="px-2 py-3 text-sm text-white">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs font-medium ${
                              transaction.transaction_type === "income"
                                ? "bg-green-600"
                                : transaction.transaction_type === "expense"
                                  ? "bg-red-600"
                                  : "bg-gray-600"
                            }`}
                          >
                            {getTransactionTypeLabel(
                              transaction.transaction_type,
                            )}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-sm text-white">
                          {transaction.debit_account}
                          {transaction.debit_sub_account && (
                            <div className="text-primary-muted text-xs">
                              {transaction.debit_sub_account}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm text-right text-white">
                          {formatAmount(transaction.debit_amount)}
                        </td>
                        <td className="px-2 py-3 text-sm text-white">
                          {transaction.credit_account}
                          {transaction.credit_sub_account && (
                            <div className="text-primary-muted text-xs">
                              {transaction.credit_sub_account}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm text-right text-white">
                          {formatAmount(transaction.credit_amount)}
                        </td>
                        <td className="px-2 py-3 text-sm text-white">
                          {transaction.description || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(data.page - 1)}
                    disabled={data.page <= 1}
                    className={`bg-primary-accent text-white border-0 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors duration-200 ${
                      data.page <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    }`}
                  >
                    前へ
                  </button>

                  <div className="flex gap-1">
                    {Array.from(
                      { length: Math.min(5, data.totalPages) },
                      (_, i) => {
                        let pageNum: number;
                        if (data.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (data.page <= 3) {
                          pageNum = i + 1;
                        } else if (data.page >= data.totalPages - 2) {
                          pageNum = data.totalPages - 4 + i;
                        } else {
                          pageNum = data.page - 2 + i;
                        }

                        return (
                          <button
                            type="button"
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm border-0 rounded-lg cursor-pointer transition-colors duration-200 text-white ${
                              pageNum === data.page
                                ? "bg-primary-accent"
                                : "bg-primary-hover hover:bg-primary-border"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(data.page + 1)}
                    disabled={data.page >= data.totalPages}
                    className={`bg-primary-accent text-white border-0 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors duration-200 ${
                      data.page >= data.totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    }`}
                  >
                    次へ
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
