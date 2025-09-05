"use client";

import { useState } from "react";
import MainButton from "@/client/components/ui/MainButton";
import { downloadTransactionsCsv } from "@/server/actions/download-transactions-csv";

export default function CsvDownloadButton() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const result = await downloadTransactionsCsv();

      if (result.success && result.data) {
        // BOMを追加してUTF-8で保存
        const blob = new Blob([`\uFEFF${result.data}`], {
          type: "text/csv;charset=utf-8;",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename || "transactions.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert(result.error || "ダウンロードに失敗しました");
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("ダウンロードに失敗しました");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <MainButton onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? "ダウンロード中..." : "CSVでダウンロード"}
    </MainButton>
  );
}
