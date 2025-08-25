"use client";

import { useState, useEffect } from "react";
import type { MfCsvRecord } from "@/server/lib/mf-csv-loader";

interface CsvPreviewProps {
  file: File | null;
  onParseComplete?: (records: MfCsvRecord[], isValid: boolean) => void;
}

export default function CsvPreview({ file, onParseComplete }: CsvPreviewProps) {
  const [records, setRecords] = useState<MfCsvRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    if (!file) {
      setRecords([]);
      setError(null);
      setTotalRows(0);
      return;
    }

    const parseFile = async () => {
      setLoading(true);
      setError(null);

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

        const previewLines = dataLines.slice(0, 10);
        const parsedRecords = previewLines.map(line => {
          const values = parseCSVLine(line);
          return createRecord(headers, values, columnMapping);
        });

        setRecords(parsedRecords);
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

  if (records.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: "16px" }}>
      <h3>CSVプレビュー</h3>
      <p className="muted" style={{ marginBottom: "16px" }}>
        全 {totalRows} 件中 最初の {Math.min(10, records.length)} 件を表示
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
            {records.map((record, index) => (
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
    </div>
  );
}
