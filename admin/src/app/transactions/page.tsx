"use client";

import { useState, useEffect } from "react";
import { apiClient, TransactionListResponse } from "@/client/api-client";

export default function TransactionsPage() {
  const [data, setData] = useState<TransactionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const perPage = 50;

  useEffect(() => {
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
    <div className="card">
      <div className="row">
        <h1>取引一覧</h1>
        <button
          onClick={handleDeleteAll}
          disabled={deleting || loading || !data || data.total === 0}
          className="button"
          style={{
            background: "#ef4444",
            color: "white",
            opacity: deleting || loading || !data || data.total === 0 ? 0.5 : 1,
            cursor:
              deleting || loading || !data || data.total === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          {deleting ? "削除中..." : "全件削除"}
        </button>
      </div>

      {loading && <p className="muted">読み込み中...</p>}

      {error && (
        <div style={{ color: "#ff6b6b", marginTop: "16px" }}>
          エラー: {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div style={{ marginTop: "20px", marginBottom: "16px" }}>
            <p className="muted">
              全 {data.total} 件中 {(data.page - 1) * data.perPage + 1} -{" "}
              {Math.min(data.page * data.perPage, data.total)} 件を表示
            </p>
          </div>

          {data.transactions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p className="muted">トランザクションが登録されていません</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #374151" }}>
                      <th
                        style={{
                          padding: "12px 8px",
                          textAlign: "left",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        取引日
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          textAlign: "left",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        種別
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          textAlign: "left",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        借方
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          textAlign: "right",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        借方金額
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          textAlign: "left",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        貸方
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          textAlign: "right",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        貸方金額
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          textAlign: "left",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        摘要
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        style={{ borderBottom: "1px solid #374151" }}
                      >
                        <td style={{ padding: "12px 8px", fontSize: "14px" }}>
                          {formatDate(transaction.transaction_date)}
                        </td>
                        <td style={{ padding: "12px 8px", fontSize: "14px" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              backgroundColor:
                                transaction.transaction_type === "income"
                                  ? "#10b981"
                                  : transaction.transaction_type === "expense"
                                    ? "#ef4444"
                                    : "#6b7280",
                              color: "white",
                            }}
                          >
                            {getTransactionTypeLabel(
                              transaction.transaction_type,
                            )}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", fontSize: "14px" }}>
                          {transaction.debit_account}
                          {transaction.debit_sub_account && (
                            <div className="muted" style={{ fontSize: "12px" }}>
                              {transaction.debit_sub_account}
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            fontSize: "14px",
                            textAlign: "right",
                          }}
                        >
                          {formatAmount(transaction.debit_amount)}
                        </td>
                        <td style={{ padding: "12px 8px", fontSize: "14px" }}>
                          {transaction.credit_account}
                          {transaction.credit_sub_account && (
                            <div className="muted" style={{ fontSize: "12px" }}>
                              {transaction.credit_sub_account}
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            fontSize: "14px",
                            textAlign: "right",
                          }}
                        >
                          {formatAmount(transaction.credit_amount)}
                        </td>
                        <td style={{ padding: "12px 8px", fontSize: "14px" }}>
                          {transaction.description || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.totalPages > 1 && (
                <div
                  style={{
                    marginTop: "24px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => handlePageChange(data.page - 1)}
                    disabled={data.page <= 1}
                    className="button"
                    style={{
                      padding: "8px 12px",
                      fontSize: "14px",
                      opacity: data.page <= 1 ? 0.5 : 1,
                      cursor: data.page <= 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    前へ
                  </button>

                  <div style={{ display: "flex", gap: "4px" }}>
                    {Array.from(
                      { length: Math.min(5, data.totalPages) },
                      (_, i) => {
                        let pageNum;
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
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className="button"
                            style={{
                              padding: "8px 12px",
                              fontSize: "14px",
                              backgroundColor:
                                pageNum === data.page ? "#3b82f6" : "#374151",
                              color: "white",
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(data.page + 1)}
                    disabled={data.page >= data.totalPages}
                    className="button"
                    style={{
                      padding: "8px 12px",
                      fontSize: "14px",
                      opacity: data.page >= data.totalPages ? 0.5 : 1,
                      cursor:
                        data.page >= data.totalPages
                          ? "not-allowed"
                          : "pointer",
                    }}
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
