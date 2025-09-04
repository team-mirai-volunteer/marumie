import "server-only";

import { PrismaClient } from "@prisma/client";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import { SavePreviewTransactionsUsecase } from "@/server/usecases/save-preview-transactions-usecase";
import type { PreviewTransaction } from "@/server/lib/mf-record-converter";

const prisma = new PrismaClient();
const transactionRepository = new PrismaTransactionRepository(prisma);
const uploadUsecase = new SavePreviewTransactionsUsecase(transactionRepository);

export interface UploadCsvRequest {
  validTransactions: PreviewTransaction[];
  politicalOrganizationId: string;
}

export interface UploadCsvResponse {
  ok: boolean;
  processedCount: number;
  savedCount: number;
  skippedCount: number;
  message: string;
  errors?: string[];
}

export async function uploadCsv(
  data: UploadCsvRequest,
): Promise<UploadCsvResponse> {
  try {
    const { validTransactions, politicalOrganizationId } = data;

    if (!validTransactions || !Array.isArray(validTransactions)) {
      throw new Error("有効なトランザクションデータが指定されていません");
    }

    if (!politicalOrganizationId) {
      throw new Error("政治団体IDが指定されていません");
    }

    const result = await uploadUsecase.execute({
      validTransactions,
      politicalOrganizationId,
    });

    if (result.errors.length > 0) {
      return {
        ok: false,
        processedCount: result.processedCount,
        savedCount: result.savedCount,
        skippedCount: result.skippedCount,
        message: `${result.processedCount}件を処理し、${result.savedCount}件を保存、${result.skippedCount}件をスキップしました`,
        errors: result.errors,
      };
    }

    const message =
      result.skippedCount > 0
        ? `${result.processedCount}件を処理し、${result.savedCount}件を新規保存、${result.skippedCount}件を重複のためスキップしました`
        : `${result.processedCount}件を処理し、${result.savedCount}件を保存しました`;

    return {
      ok: true,
      processedCount: result.processedCount,
      savedCount: result.savedCount,
      skippedCount: result.skippedCount,
      message,
    };
  } catch (error) {
    console.error("Upload CSV error:", error);
    throw error instanceof Error
      ? error
      : new Error("サーバー内部エラーが発生しました");
  } finally {
    await prisma.$disconnect();
  }
}
