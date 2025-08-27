"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/client/clients/api-client";
import type { PreviewTransaction, PreviewMfCsvResult } from "@/server/usecases/preview-mf-csv-usecase";

interface CsvPreviewProps {
  file: File | null;
  politicalOrganizationId: string;
  onPreviewComplete?: (result: PreviewMfCsvResult) => void;
}

export default function CsvPreview({ file, politicalOrganizationId, onPreviewComplete }: CsvPreviewProps) {
  const [previewResult, setPreviewResult] = useState<PreviewMfCsvResult | null>(null);
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
        const errorMessage = err instanceof Error ? err.message : "CSVのプレビューに失敗しました";
        setError(errorMessage);
        onPreviewComplete?.({
          transactions: [],
          summary: { totalCount: 0, validCount: 0, invalidCount: 0, skipCount: 0 }
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

  const totalPages = previewResult ? Math.ceil(getSortedTransactions().length / perPage) : 0;

  const getStatusColor = (status: PreviewTransaction['status']) => {
    switch (status) {
      case 'valid': return '#10b981';
      case 'invalid': return '#ef4444';
      case 'skip': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: PreviewTransaction['status']) => {
    switch (status) {
      case 'valid': return '有効';
      case 'invalid': return '無効';
      case 'skip': return 'スキップ';
      default: return '不明';
    }
  };

  if (!file) return null;

  if (loading) {
    return (
      <div className="card" style={{ marginTop: "16px" }}>
        <h3>CSVプレビュー</h3>
        <p className="muted">ファイルを処理中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ marginTop: "16px" }}>
        <h3>CSVプレビュー</h3>
        <div style={{ color: "#ff6b6b", marginTop: "8px" }}>
          エラー: {error}
        </div>
      </div>
    );
  }

  if (!previewResult || previewResult.transactions.length === 0) return null;

  const currentRecords = getCurrentPageRecords();

  return (
    <div className="card" style={{ marginTop: "16px" }}>
      <h3>CSVプレビュー</h3>
      <div style={{ marginBottom: "16px" }}>
        <p className="muted">
          全 {previewResult.summary.totalCount} 件中 {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, previewResult.summary.totalCount)} 件を表示
        </p>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', marginTop: '8px' }}>
          <span style={{ color: getStatusColor('valid') }}>有効: {previewResult.summary.validCount}件</span>
          <span style={{ color: getStatusColor('invalid') }}>無効: {previewResult.summary.invalidCount}件</span>
          <span style={{ color: getStatusColor('skip') }}>スキップ: {previewResult.summary.skipCount}件</span>
        </div>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #374151" }}>
              <th style={{ padding: "12px 8px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>
                状態
              </th>
              <th style={{ padding: "12px 8px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>
                取引日
              </th>
              <th style={{ padding: "12px 8px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>
                借方勘定科目
              </th>
              <th style={{ padding: "12px 8px", textAlign: "right", fontSize: "14px", fontWeight: "600" }}>
                借方金額
              </th>
              <th style={{ padding: "12px 8px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>
                貸方勘定科目
              </th>
              <th style={{ padding: "12px 8px", textAlign: "right", fontSize: "14px", fontWeight: "600" }}>
                貸方金額
              </th>
              <th style={{ padding: "12px 8px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>
                摘要
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #374151" }}>
                <td style={{ padding: "12px 8px", fontSize: "14px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      color: "white",
                      backgroundColor: getStatusColor(record.status),
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    {getStatusText(record.status)}
                  </span>
                  {record.errors.length > 0 && (
                    <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>
                      {record.errors.join(", ")}
                    </div>
                  )}
                  {record.skipReason && (
                    <div style={{ fontSize: "11px", color: "#f59e0b", marginTop: "4px" }}>
                      {record.skipReason}
                    </div>
                  )}
                </td>
                <td style={{ padding: "12px 8px", fontSize: "14px" }}>
                  {new Date(record.transaction_date).toLocaleDateString('ja-JP')}
                </td>
                <td style={{ padding: "12px 8px", fontSize: "14px" }}>
                  {record.debit_account}
                  {record.debit_sub_account && (
                    <div className="muted" style={{ fontSize: "12px" }}>
                      {record.debit_sub_account}
                    </div>
                  )}
                </td>
                <td style={{ padding: "12px 8px", fontSize: "14px", textAlign: "right" }}>
                  {record.debit_amount ? `¥${record.debit_amount.toLocaleString()}` : "-"}
                </td>
                <td style={{ padding: "12px 8px", fontSize: "14px" }}>
                  {record.credit_account}
                  {record.credit_sub_account && (
                    <div className="muted" style={{ fontSize: "12px" }}>
                      {record.credit_sub_account}
                    </div>
                  )}
                </td>
                <td style={{ padding: "12px 8px", fontSize: "14px", textAlign: "right" }}>
                  {record.credit_amount ? `¥${record.credit_amount.toLocaleString()}` : "-"}
                </td>
                <td style={{ padding: "12px 8px", fontSize: "14px" }}>
                  {record.description || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
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
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="button"
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              opacity: currentPage <= 1 ? 0.5 : 1,
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
            }}
          >
            前へ
          </button>

          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {totalPages <= 7 ? (
              Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
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
              ))
            ) : (
              <>
                {currentPage <= 4 ? (
                  <>
                    {[1, 2, 3, 4, 5].map((pageNum) => (
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
                    ))}
                    <span style={{ padding: "8px 4px", color: "#9ca3af" }}>...</span>
                    <button
                      type="button"
                      onClick={() => handlePageChange(totalPages)}
                      className="button"
                      style={{
                        padding: "8px 12px",
                        fontSize: "14px",
                        backgroundColor:
                          totalPages === currentPage ? "#3b82f6" : "#374151",
                        color: "white",
                      }}
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
                    <span style={{ padding: "8px 4px", color: "#9ca3af" }}>...</span>
                    {[totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages].map((pageNum) => (
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
                    <span style={{ padding: "8px 4px", color: "#9ca3af" }}>...</span>
                    {[currentPage - 1, currentPage, currentPage + 1].map((pageNum) => (
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
                    ))}
                    <span style={{ padding: "8px 4px", color: "#9ca3af" }}>...</span>
                    <button
                      type="button"
                      onClick={() => handlePageChange(totalPages)}
                      className="button"
                      style={{
                        padding: "8px 12px",
                        fontSize: "14px",
                        backgroundColor:
                          totalPages === currentPage ? "#3b82f6" : "#374151",
                        color: "white",
                      }}
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
            className="button"
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              opacity: currentPage >= totalPages ? 0.5 : 1,
              cursor:
                currentPage >= totalPages
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
