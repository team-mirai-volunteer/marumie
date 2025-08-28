"use client";
import "client-only";

import { useState, useEffect } from "react";
import { apiClient } from "@/client/clients/api-client";
import type {
  PreviewTransaction,
  PreviewMfCsvResult,
} from "@/server/usecases/preview-mf-csv-usecase";

interface CsvPreviewProps {
  file: File | null;
  politicalOrganizationId: string;
  onPreviewComplete?: (result: PreviewMfCsvResult) => void;
}

export default function CsvPreview({
  file,
  politicalOrganizationId,
  onPreviewComplete,
}: CsvPreviewProps) {
  const [previewResult, setPreviewResult] = useState<PreviewMfCsvResult | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (!file || !politicalOrganizationId) {
      setPreviewResult(null);
      setError(null);
      setCurrentPage(1);
      return;
    }

    const previewFile = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      try {
        const result = await apiClient.previewCsv({
          file,
          politicalOrganizationId,
        });

        setPreviewResult(result);
        onPreviewComplete?.(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "CSVのプレビューに失敗しました";
        setError(errorMessage);
        onPreviewComplete?.({
          transactions: [],
          summary: {
            totalCount: 0,
            validCount: 0,
            invalidCount: 0,
            skipCount: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    previewFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, politicalOrganizationId]);

  const handlePageChange = (page: number) => {
    if (!previewResult) return;
    const totalPages = Math.ceil(previewResult.transactions.length / perPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getSortedTransactions = (): PreviewTransaction[] => {
    if (!previewResult) return [];

    // 有効・無効・スキップの順でソート
    const statusOrder = { valid: 1, invalid: 2, skip: 3 };
    return [...previewResult.transactions].sort((a, b) => {
      const aOrder = statusOrder[a.status] || 4;
      const bOrder = statusOrder[b.status] || 4;
      return aOrder - bOrder;
    });
  };

  const getCurrentPageRecords = (): PreviewTransaction[] => {
    const sortedTransactions = getSortedTransactions();
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return sortedTransactions.slice(startIndex, endIndex);
  };

  const totalPages = previewResult
    ? Math.ceil(getSortedTransactions().length / perPage)
    : 0;

  const getStatusColorClass = (status: PreviewTransaction["status"]) => {
    switch (status) {
      case "valid":
        return "text-green-500";
      case "invalid":
        return "text-red-500";
      case "skip":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBgClass = (status: PreviewTransaction["status"]) => {
    switch (status) {
      case "valid":
        return "bg-green-600";
      case "invalid":
        return "bg-red-600";
      case "skip":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusText = (status: PreviewTransaction["status"]) => {
    switch (status) {
      case "valid":
        return "有効";
      case "invalid":
        return "無効";
      case "skip":
        return "スキップ";
      default:
        return "不明";
    }
  };

  if (!file) return null;

  if (loading) {
    return (
      <div className="bg-primary-panel rounded-xl p-4 mt-4">
        <h3 className="text-lg font-medium text-white mb-2">CSVプレビュー</h3>
        <p className="text-primary-muted">ファイルを処理中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-primary-panel rounded-xl p-4 mt-4">
        <h3 className="text-lg font-medium text-white mb-2">CSVプレビュー</h3>
        <div className="text-red-500 mt-2">エラー: {error}</div>
      </div>
    );
  }

  if (!previewResult || previewResult.transactions.length === 0) return null;

  const currentRecords = getCurrentPageRecords();

  return (
    <div className="bg-primary-panel rounded-xl p-4 mt-4">
      <h3 className="text-lg font-medium text-white mb-4">CSVプレビュー</h3>
      <div className="mb-4">
        <p className="text-primary-muted">
          全 {previewResult.summary.totalCount} 件中{" "}
          {(currentPage - 1) * perPage + 1} -{" "}
          {Math.min(currentPage * perPage, previewResult.summary.totalCount)}{" "}
          件を表示
        </p>
        <div className="flex gap-4 text-sm mt-2">
          <span className={getStatusColorClass("valid")}>
            有効: {previewResult.summary.validCount}件
          </span>
          <span className={getStatusColorClass("invalid")}>
            無効: {previewResult.summary.invalidCount}件
          </span>
          <span className={getStatusColorClass("skip")}>
            スキップ: {previewResult.summary.skipCount}件
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-primary-border">
              <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                状態
              </th>
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
                摘要
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record, index) => (
              <tr key={index} className="border-b border-primary-border">
                <td className="px-2 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-semibold ${getStatusBgClass(record.status)}`}
                  >
                    {getStatusText(record.status)}
                  </span>
                  {record.errors.length > 0 && (
                    <div className="text-xs text-red-500 mt-1">
                      {record.errors.join(", ")}
                    </div>
                  )}
                  {record.skipReason && (
                    <div className="text-xs text-yellow-500 mt-1">
                      {record.skipReason}
                    </div>
                  )}
                </td>
                <td className="px-2 py-3 text-sm text-white">
                  {new Date(record.transaction_date).toLocaleDateString(
                    "ja-JP",
                  )}
                </td>
                <td className="px-2 py-3 text-sm text-white">
                  {record.debit_account}
                  {record.debit_sub_account && (
                    <div className="text-primary-muted text-xs">
                      {record.debit_sub_account}
                    </div>
                  )}
                </td>
                <td className="px-2 py-3 text-sm text-right text-white">
                  {record.debit_amount
                    ? `¥${record.debit_amount.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-2 py-3 text-sm text-white">
                  {record.credit_account}
                  {record.credit_sub_account && (
                    <div className="text-primary-muted text-xs">
                      {record.credit_sub_account}
                    </div>
                  )}
                </td>
                <td className="px-2 py-3 text-sm text-right text-white">
                  {record.credit_amount
                    ? `¥${record.credit_amount.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-2 py-3 text-sm text-white">
                  {record.description || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`bg-primary-accent text-white border-0 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors duration-200 ${
              currentPage <= 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            前へ
          </button>

          <div className="flex gap-1 items-center">
            {totalPages <= 7 ? (
              Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    type="button"
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm border-0 rounded-lg cursor-pointer transition-colors duration-200 text-white ${
                      pageNum === currentPage
                        ? "bg-primary-accent"
                        : "bg-primary-hover hover:bg-primary-border"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )
            ) : (
              <>
                {currentPage <= 4 ? (
                  <>
                    {[1, 2, 3, 4, 5].map((pageNum) => (
                      <button
                        type="button"
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm border-0 rounded-lg cursor-pointer transition-colors duration-200 text-white ${
                          pageNum === currentPage
                            ? "bg-primary-accent"
                            : "bg-primary-hover hover:bg-primary-border"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <span className="px-1 py-2 text-primary-muted">...</span>
                    <button
                      type="button"
                      onClick={() => handlePageChange(totalPages)}
                      className={`px-3 py-2 text-sm border-0 rounded-lg cursor-pointer transition-colors duration-200 text-white ${
                        totalPages === currentPage
                          ? "bg-primary-accent"
                          : "bg-primary-hover hover:bg-primary-border"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                ) : currentPage >= totalPages - 3 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePageChange(1)}
                      className="button"
                      style={{
                        padding: "8px 12px",
                        fontSize: "14px",
                        backgroundColor:
                          1 === currentPage ? "#3b82f6" : "#374151",
                        color: "white",
                      }}
                    >
                      1
                    </button>
                    <span className="px-1 py-2 text-primary-muted">...</span>
                    {[
                      totalPages - 4,
                      totalPages - 3,
                      totalPages - 2,
                      totalPages - 1,
                      totalPages,
                    ].map((pageNum) => (
                      <button
                        type="button"
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm border-0 rounded-lg cursor-pointer transition-colors duration-200 text-white ${
                          pageNum === currentPage
                            ? "bg-primary-accent"
                            : "bg-primary-hover hover:bg-primary-border"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePageChange(1)}
                      className="button"
                      style={{
                        padding: "8px 12px",
                        fontSize: "14px",
                        backgroundColor:
                          1 === currentPage ? "#3b82f6" : "#374151",
                        color: "white",
                      }}
                    >
                      1
                    </button>
                    <span className="px-1 py-2 text-primary-muted">...</span>
                    {[currentPage - 1, currentPage, currentPage + 1].map(
                      (pageNum) => (
                        <button
                          type="button"
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className="button"
                          style={{
                            padding: "8px 12px",
                            fontSize: "14px",
                            backgroundColor:
                              pageNum === currentPage ? "#3b82f6" : "#374151",
                            color: "white",
                          }}
                        >
                          {pageNum}
                        </button>
                      ),
                    )}
                    <span className="px-1 py-2 text-primary-muted">...</span>
                    <button
                      type="button"
                      onClick={() => handlePageChange(totalPages)}
                      className={`px-3 py-2 text-sm border-0 rounded-lg cursor-pointer transition-colors duration-200 text-white ${
                        totalPages === currentPage
                          ? "bg-primary-accent"
                          : "bg-primary-hover hover:bg-primary-border"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`bg-primary-accent text-white border-0 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors duration-200 ${
              currentPage >= totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
