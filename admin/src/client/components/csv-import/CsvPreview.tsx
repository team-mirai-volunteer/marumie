"use client";
import "client-only";

import { useEffect, useRef, useState } from "react";
import type { PreviewMfCsvResult } from "@/server/usecases/preview-mf-csv-usecase";
import type { PreviewTransaction } from "@/server/lib/mf-record-converter";
import { apiClient } from "@/client/lib/api-client";
import TransactionRow from "./TransactionRow";
import { Pagination } from "@/client/components/ui/Pagination";
import StatisticsTable from "./StatisticsTable";

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
  const [activeTab, setActiveTab] = useState<
    "all" | "valid" | "invalid" | "skip"
  >("all");
  const perPage = 10;
  const onPreviewCompleteRef = useRef(onPreviewComplete);

  // Always update the ref to the latest callback
  onPreviewCompleteRef.current = onPreviewComplete;

  useEffect(() => {
    if (!file || !politicalOrganizationId) {
      setPreviewResult(null);
      setError(null);
      setCurrentPage(1);
      setActiveTab("all");
      return;
    }

    const previewFile = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      setActiveTab("all");

      try {
        const result = await apiClient.previewCsv({
          file,
          politicalOrganizationId,
        });

        setPreviewResult(result);
        onPreviewCompleteRef.current?.(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "CSVのプレビューに失敗しました";
        setError(errorMessage);
        onPreviewCompleteRef.current?.({
          transactions: [],
          summary: {
            totalCount: 0,
            validCount: 0,
            invalidCount: 0,
            skipCount: 0,
          },
          statistics: {
            valid: {
              income: { count: 0, amount: 0 },
              expense: { count: 0, amount: 0 },
              offset_income: { count: 0, amount: 0 },
              offset_expense: { count: 0, amount: 0 },
            },
            invalid: {
              income: { count: 0, amount: 0 },
              expense: { count: 0, amount: 0 },
              offset_income: { count: 0, amount: 0 },
              offset_expense: { count: 0, amount: 0 },
            },
            skip: {
              income: { count: 0, amount: 0 },
              expense: { count: 0, amount: 0 },
              offset_income: { count: 0, amount: 0 },
              offset_expense: { count: 0, amount: 0 },
            },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    previewFile();
  }, [file, politicalOrganizationId]);

  const handlePageChange = (page: number) => {
    if (!previewResult) return;
    const filteredTransactions = getFilteredTransactions();
    const totalPages = Math.ceil(filteredTransactions.length / perPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTabChange = (tab: "all" | "valid" | "invalid" | "skip") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getFilteredTransactions = (): PreviewTransaction[] => {
    if (!previewResult) return [];

    const sortedTransactions = getSortedTransactions();

    if (activeTab === "all") {
      return sortedTransactions;
    }

    return sortedTransactions.filter(
      (transaction) => transaction.status === activeTab,
    );
  };

  const getSortedTransactions = (): PreviewTransaction[] => {
    if (!previewResult) return [];

    const statusOrder = { valid: 1, invalid: 2, skip: 3 };
    return [...previewResult.transactions].sort((a, b) => {
      const aOrder = statusOrder[a.status] || 4;
      const bOrder = statusOrder[b.status] || 4;
      return aOrder - bOrder;
    });
  };

  const getCurrentPageRecords = (): PreviewTransaction[] => {
    const filteredTransactions = getFilteredTransactions();
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };

  const totalPages = previewResult
    ? Math.ceil(getFilteredTransactions().length / perPage)
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
  const filteredTransactions = getFilteredTransactions();

  const getTabCount = (tab: "all" | "valid" | "invalid" | "skip") => {
    if (tab === "all") return previewResult.summary.totalCount;
    return previewResult.transactions.filter((t) => t.status === tab).length;
  };

  const getTabLabel = (tab: "valid" | "invalid" | "skip") => {
    switch (tab) {
      case "valid":
        return "有効";
      case "invalid":
        return "無効";
      case "skip":
        return "スキップ";
    }
  };

  return (
    <div className="bg-primary-panel rounded-xl p-4 mt-4">
      <h3 className="text-lg font-medium text-white mb-4">CSVプレビュー</h3>

      <StatisticsTable statistics={previewResult.statistics} />

      {/* タブフィルター */}
      <div className="mb-4">
        <div className="flex gap-2">
          {[
            { key: "all" as const, label: "全件", color: "text-white" },
            { key: "valid" as const, label: "有効", color: "text-green-500" },
            { key: "invalid" as const, label: "無効", color: "text-red-500" },
            {
              key: "skip" as const,
              label: "スキップ",
              color: "text-yellow-500",
            },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200 ${
                activeTab === key
                  ? `${color} border-white bg-white/10`
                  : "text-primary-muted border-primary-border hover:text-white hover:border-white/50"
              }`}
            >
              {label} ({getTabCount(key)})
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-primary-muted">
          {activeTab === "all" ? "全" : getTabLabel(activeTab)}{" "}
          {filteredTransactions.length} 件中{" "}
          {filteredTransactions.length > 0
            ? (currentPage - 1) * perPage + 1
            : 0}{" "}
          - {Math.min(currentPage * perPage, filteredTransactions.length)}{" "}
          件を表示
        </p>
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
              <TransactionRow
                key={`${(currentPage - 1) * perPage + index}-${record.transaction_date}-${record.debit_account}-${record.credit_account}-${record.debit_amount || 0}`}
                record={record}
                index={index}
                currentPage={currentPage}
                perPage={perPage}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
