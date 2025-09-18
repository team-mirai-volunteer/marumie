"use server";

import { PrismaClient } from "@prisma/client";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";

const prisma = new PrismaClient();

export async function downloadTransactionsCsv() {
  try {
    const transactionRepository = new PrismaTransactionRepository(prisma);
    const transactions = await transactionRepository.findAllWithOrganization();

    const headers = [
      "取引日",
      "政治団体名",
      "借方勘定科目",
      "借方金額",
      "貸方勘定科目",
      "貸方金額",
      "種別",
      "カテゴリ",
      "摘要",
    ];

    const csvData = [
      headers.join(","),
      ...transactions.map((transaction) => {
        const row = [
          `"${new Date(transaction.transaction_date).toLocaleDateString("ja-JP")}"`,
          `"${transaction.political_organization_name || ""}"`,
          `"${transaction.debit_account.replace(/"/g, '""')}"`,
          `"${transaction.debit_amount}"`,
          `"${transaction.credit_account.replace(/"/g, '""')}"`,
          `"${transaction.credit_amount}"`,
          `"${transaction.transaction_type.replace(/"/g, '""')}"`,
          `"${transaction.friendly_category.replace(/"/g, '""')}"`,
          `"${(transaction.description || "").replace(/"/g, '""')}"`,
        ];
        return row.join(",");
      }),
    ].join("\n");

    return {
      success: true,
      csvData,
      filename: `transactions_${new Date().toISOString().split("T")[0]}.csv`,
    };
  } catch (error) {
    console.error("CSV download error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
