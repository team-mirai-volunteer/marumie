import { readFileSync } from "fs";
import { join } from "path";
import {
  UploadMfCsvUsecase,
  type UploadMfCsvInput,
} from "@/server/usecases/upload-mf-csv-usecase";
import type { ITransactionRepository } from "@/server/repositories/interfaces/transaction-repository.interface";
import type { CreateTransactionInput } from "@/shared/model/transaction";

describe("UploadMfCsvUsecase", () => {
  let usecase: UploadMfCsvUsecase;
  let mockRepository: jest.Mocked<Pick<ITransactionRepository, 'createManySkipDuplicates'>>;

  beforeEach(() => {
    mockRepository = { createManySkipDuplicates: jest.fn(), };
    usecase = new UploadMfCsvUsecase(mockRepository as unknown as ITransactionRepository);
  });

  describe("execute with sample data", () => {
    it("should process sample CSV and calculate correct expense/income/other totals", async () => {
      // テスト用サンプルデータを読み込み
      const sampleCsvPath = join(__dirname, "../../data/sampledata.csv");
      const csvContent = readFileSync(sampleCsvPath, "utf-8");

      // Repositoryのモック設定
      const capturedTransactions: CreateTransactionInput[] = [];
      mockRepository.createManySkipDuplicates.mockImplementation(
        async (transactions) => {
          capturedTransactions.push(...transactions);
          return {
            created: transactions.map(t => ({ ...t, id: 'test-id', created_at: new Date(), updated_at: new Date() })),
            skipped: 0,
          };
        }
      );

      const input: UploadMfCsvInput = {
        csvContent,
        politicalOrganizationId: "test-org-id",
      };

      // Usecase実行
      const result = await usecase.execute(input);

      // 基本的な結果検証
      expect(result.errors).toEqual([]);
      expect(result.processedCount).toBeGreaterThan(0);
      expect(result.savedCount).toBe(result.processedCount);

      // 取引種別ごとの金額集計
      const expenseTotal = capturedTransactions
        .filter((t) => t.transaction_type === "expense")
        .reduce((sum, t) => sum + t.debit_amount, 0);

      const incomeTotal = capturedTransactions
        .filter((t) => t.transaction_type === "income")
        .reduce((sum, t) => sum + t.credit_amount, 0);

      const otherTotal = capturedTransactions
        .filter((t) => t.transaction_type === "other")
        .reduce((sum, t) => sum + Math.max(t.debit_amount, t.credit_amount), 0);

      // サンプルデータから期待値を計算
      // income: 普通預金が借方（寄附収入）= 12,252,423円
      // expense: 普通預金が貸方（支出）= 10,058,725円
      // other: 普通預金以外の取引 = 0円（サンプルデータには該当なし）
      expect(incomeTotal).toBe(12252423);
      expect(expenseTotal).toBe(10058725);
      expect(otherTotal).toBe(0);

      // Repository呼び出し検証
      expect(mockRepository.createManySkipDuplicates).toHaveBeenCalledTimes(1);
      expect(mockRepository.createManySkipDuplicates).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            political_organization_id: "test-org-id",
            transaction_type: expect.stringMatching(/^(income|expense|other)$/),
          }),
        ])
      );
    });

    it("should handle empty CSV content", async () => {
      const input: UploadMfCsvInput = {
        csvContent: "",
        politicalOrganizationId: "test-org-id",
      };

      const result = await usecase.execute(input);

      expect(result.processedCount).toBe(0);
      expect(result.savedCount).toBe(0);
      expect(result.skippedCount).toBe(0);
      expect(result.errors).toEqual([]);
      expect(mockRepository.createManySkipDuplicates).not.toHaveBeenCalled();
    });

    it("should handle repository errors gracefully", async () => {
      const sampleCsvPath = join(__dirname, "../../data/sampledata.csv");
      const csvContent = readFileSync(sampleCsvPath, "utf-8");

      mockRepository.createManySkipDuplicates.mockRejectedValue(
        new Error("Database connection failed")
      );

      const input: UploadMfCsvInput = {
        csvContent,
        politicalOrganizationId: "test-org-id",
      };

      const result = await usecase.execute(input);

      expect(result.errors).toContain("Database connection failed");
      expect(result.savedCount).toBe(0);
    });
  });
});
