"use client";
import "client-only";

import { useEffect, useState } from "react";
import {
  apiClient,
  type TransactionListResponse,
} from "@/client/lib/api-client";
import { TransactionRow } from "@/client/components/transactions/TransactionRow";
import { Pagination } from "@/client/components/ui/Pagination";

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
                        借方勘定科目
                      </th>
                      <th className="px-2 py-3 text-right text-sm font-semibold text-white">
                        借方金額
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                        貸方勘定科目
                      </th>
                      <th className="px-2 py-3 text-right text-sm font-semibold text-white">
                        貸方金額
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                        種別
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                        カテゴリ
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                        摘要{" "}
                        <span className="text-xs font-normal">
                          ※サービスには表示されません
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((transaction) => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
