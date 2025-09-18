"use server";

import { loadAllTransactionsData } from "@/server/loaders/load-all-transactions-data";

export async function downloadTransactionsCsv() {
  try {
    // すべてのトランザクションを取得
    const data = await loadAllTransactionsData({
      slugs: ["team-mirai", "digimin"],
      financialYear: 2025,
    });

    // CSVヘッダー
    const headers = [
      "日付",
      "タイプ",
      "金額",
      "カテゴリ",
      "科目",
      "チームみらい区分",
      "ラベル",
      "政治団体名",
    ];

    // CSVデータを作成
    const csvRows = [
      headers.join(","),
      ...data.transactions.map((transaction) => {
        const row = [
          new Date(transaction.date).toISOString().split("T")[0],
          transaction.transactionType === "income" ? "収入" : "支出",
          transaction.amount.toString(),
          `"${transaction.category.replace(/"/g, '""')}"`,
          `"${transaction.account.replace(/"/g, '""')}"`, // CSVエスケープ
          `"${(transaction.friendly_category || "").replace(/"/g, '""')}"`,
          `"${transaction.label.replace(/"/g, '""')}"`,
          `"${(transaction.political_organization_name || "").replace(/"/g, '""')}"`,
        ];
        return row.join(",");
      }),
    ];

    const csvContent = csvRows.join("\n");

    // ダウンロード用のレスポンスを返す
    const now = new Date();
    const timestamp = now.toISOString().split("T")[0];
    const filename = `transactions_${timestamp}.csv`;

    return {
      success: true,
      data: csvContent,
      filename,
    };
  } catch (error) {
    console.error("CSV download error:", error);
    return {
      success: false,
      error: "CSVのダウンロードに失敗しました",
    };
  }
}
