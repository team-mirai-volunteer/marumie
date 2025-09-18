"use client";

import React from "react";
import { downloadTransactionsCsv } from "@/server/actions/download-transactions-csv";

interface CsvDownloadButtonProps {
  disabled?: boolean;
  className?: string;
}

export function CsvDownloadButton({
  disabled = false,
  className = "",
}: CsvDownloadButtonProps) {
  const handleDownload = async () => {
    try {
      const result = await downloadTransactionsCsv();

      if (result.success && result.csvData) {
        const blob = new Blob([result.csvData], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename || "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        console.error("CSV download failed:", result.error);
        alert("CSVダウンロードに失敗しました");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("CSVダウンロードに失敗しました");
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      CSV ダウンロード
    </button>
  );
}
