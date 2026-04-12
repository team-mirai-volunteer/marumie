import "server-only";

import type { ITransactionRepository } from "@/server/contexts/shared/domain/repositories/transaction-repository.interface";
import type { ICacheInvalidator } from "@/server/contexts/shared/domain/services/cache-invalidator.interface";
import { PreviewTransaction } from "@/server/contexts/data-import/domain/models/preview-transaction";

export interface SavePreviewTransactionsInput {
  validTransactions: PreviewTransaction[];
  politicalOrganizationId: string;
}

interface SavePreviewTransactionsResult {
  processedCount: number;
  savedCount: number;
  skippedCount: number;
  errors: string[];
}

export class SavePreviewTransactionsUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private cacheInvalidator: ICacheInvalidator,
  ) {}

  async execute(input: SavePreviewTransactionsInput): Promise<SavePreviewTransactionsResult> {
    const result: SavePreviewTransactionsResult = {
      processedCount: 0,
      savedCount: 0,
      skippedCount: 0,
      errors: [],
    };

    try {
      // Basic validation
      if (!input.validTransactions || input.validTransactions.length === 0) {
        result.errors.push("有効なトランザクションがありません");
        return result;
      }

      if (!input.politicalOrganizationId) {
        result.errors.push("政治組織IDが指定されていません");
        return result;
      }

      const saveableTransactions = input.validTransactions.filter(
        (t) => (t.status === "insert" || t.status === "update") && t.transaction_type !== null,
      );

      result.processedCount = input.validTransactions.length;
      result.skippedCount = input.validTransactions.filter((t) => t.status === "skip").length;

      // insertとupdateに分けて処理
      const insertTransactions = saveableTransactions.filter((t) => t.status === "insert");
      const updateTransactions = saveableTransactions.filter((t) => t.status === "update");

      // CSV内で同じ transaction_no が重複していないかチェック
      const duplicateTransactionNos = findDuplicateTransactionNos(insertTransactions);
      if (duplicateTransactionNos.length > 0) {
        const displayNos = duplicateTransactionNos.slice(0, 5).join(", ");
        const suffix = duplicateTransactionNos.length > 5 ? ` 他${duplicateTransactionNos.length - 5}件` : "";
        result.errors.push(
          `CSV内に同じ取引No（transaction_no）が重複しています: ${displayNos}${suffix}。重複行を削除してから再度インポートしてください。`,
        );
        return result;
      }

      let savedCount = 0;

      // bulk insert
      if (insertTransactions.length > 0) {
        const createInputs = insertTransactions.map((transaction) =>
          PreviewTransaction.toCreateInput(transaction, input.politicalOrganizationId),
        );
        const createdTransactions = await this.transactionRepository.createMany(createInputs);
        savedCount += createdTransactions.length;
      }

      // bulk update
      if (updateTransactions.length > 0) {
        const updateData = updateTransactions.map((transaction) => ({
          where: {
            politicalOrganizationId: BigInt(input.politicalOrganizationId),
            transactionNo: transaction.transaction_no,
          },
          update: PreviewTransaction.toUpdateInput(transaction),
        }));
        const updatedTransactions = await this.transactionRepository.updateMany(updateData);
        savedCount += updatedTransactions.length;
      }

      result.savedCount = savedCount;

      // 保存成功時に webapp のキャッシュを無効化
      if (result.savedCount > 0) {
        await this.cacheInvalidator.invalidateWebappCache();
      }
    } catch (error) {
      console.error("Upload CSV error:", error);
      result.errors.push("データの保存中にエラーが発生しました");
    }

    return result;
  }
}

function findDuplicateTransactionNos(transactions: PreviewTransaction[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const t of transactions) {
    if (seen.has(t.transaction_no)) {
      duplicates.add(t.transaction_no);
    }
    seen.add(t.transaction_no);
  }
  return [...duplicates];
}
