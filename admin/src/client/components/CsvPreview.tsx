"use client";

import { useState, useEffect } from "react";
import type { MfCsvRecord } from "@/server/lib/mf-csv-loader";

interface CsvPreviewProps {
  file: File | null;
  onParseComplete?: (records: MfCsvRecord[], isValid: boolean) => void;
}

export default function CsvPreview({ file, onParseComplete }: CsvPreviewProps) {
  const [allRecords, setAllRecords] = useState<MfCsvRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (!file) {
      setAllRecords([]);
      setError(null);
      setTotalRows(0);
      setCurrentPage(1);
      return;
    }

    const parseFile = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      try {
        const text = await file.text();
        
        const lines = text.trim().split("\n");
        if (lines.length === 0) {
          throw new Error("CSVファイルが空です");
        }

        const headerLine = lines[0];
        const headers = parseCSVLine(headerLine);
        
        if (headers.length === 0) {
          throw new Error("CSVヘッダーが見つかりません");
        }

        const columnMapping: Record<string, string> = {
          "取引No": "transaction_no",
          "取引日": "transaction_date",
          "借方勘定科目": "debit_account",
          "借方補助科目": "debit_sub_account",
          "借方金額(円)": "debit_amount",
          "貸方勘定科目": "credit_account",
          "貸方補助科目": "credit_sub_account", 
          "貸方金額(円)": "credit_amount",
          "摘要": "description"
        };

        const hasValidHeaders = headers.some(header => header in columnMapping);
        if (!hasValidHeaders) {
          throw new Error("認識できるCSVヘッダーが見つかりません");
        }

        const dataLines = lines.slice(1).filter(line => line.trim());
        setTotalRows(dataLines.length);

        const parsedRecords = dataLines.map(line => {
          const values = parseCSVLine(line);
          return createRecord(headers, values, columnMapping);
        });

        setAllRecords(parsedRecords);
        onParseComplete?.(parsedRecords, true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "CSVの解析に失敗しました";
        setError(errorMessage);
        onParseComplete?.([], false);
      } finally {
        setLoading(false);
      }
    };

    parseFile();
  }, [file, onParseComplete]);

  const parseCSVLine = (line: string): string[] => {
    const chars = Array.from(line);
    const { result, current } = chars.reduce(
      (acc, char) => {
        if (char === '"') {
          return { ...acc, inQuotes: !acc.inQuotes };
        } else if (char === "," && !acc.inQuotes) {
          return {
            result: [...acc.result, acc.current],
            current: "",
            inQuotes: acc.inQuotes,
          };
        } else {
          return { ...acc, current: acc.current + char };
        }
      },
      { result: [] as string[], current: "", inQuotes: false },
    );
    return [...result, current];
  };

  const createRecord = (headers: string[], values: string[], columnMapping: Record<string, string>): MfCsvRecord => {
    const record = headers
      .map((header, index) => ({
        header,
        value: values[index] || "",
        mappedKey: columnMapping[header],
      }))
      .filter(({ mappedKey }) => mappedKey)
      .reduce(
        (acc, { mappedKey, value }) => ({
          ...acc,
          [mappedKey]: value,
        }),
        {} as Partial<MfCsvRecord>,
      );

    const defaultRecord: MfCsvRecord = {
      transaction_no: "",
      transaction_date: "",
      debit_account: "",
      debit_sub_account: "",
      debit_department: "",
      debit_partner: "",
      debit_tax_category: "",
      debit_invoice: "",
      debit_amount: "",
      credit_account: "",
      credit_sub_account: "",
      credit_department: "",
      credit_partner: "",
      credit_tax_category: "",
      credit_invoice: "",
      credit_amount: "",
      description: "",
      tags: "",
      memo: "",
    };

    return { ...defaultRecord, ...record };
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(totalRows / perPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getCurrentPageRecords = () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return allRecords.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(totalRows / perPage);

  if (!file) return null;

  if (loading) {
    return (
      <div className="card" style={{ marginTop: "16px" }}>
        <h3>CSVプレビュー</h3>
        <p className="muted">ファイルを解析中...</p>
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

  if (allRecords.length === 0) return null;

  const currentRecords = getCurrentPageRecords();

  return (
    <div className="card" style={{ marginTop: "16px" }}>
      <h3>CSVプレビュー</h3>
      <p className="muted" style={{ marginBottom: "16px" }}>
        全 {totalRows} 件中 {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, totalRows)} 件を表示
      </p>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #374151" }}>
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
                  {record.transaction_date}
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
                  {record.debit_amount ? `¥${parseInt(record.debit_amount).toLocaleString()}` : "-"}
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
                  {record.credit_amount ? `¥${parseInt(record.credit_amount).toLocaleString()}` : "-"}
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
