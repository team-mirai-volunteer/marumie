import { readFileSync } from "fs";
import { join } from "path";
import {
  UploadMfCsvUsecase,
  type UploadMfCsvInput,
} from "@/server/usecases/upload-mf-csv-usecase";
import type { ITransactionRepository } from "@/server/repositories/interfaces/transaction-repository.interface";
import type { CreateTransactionInput } from "@/shared/models/transaction";

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

    it("should reject invalid account labels and not call repository", async () => {
      // 有効と無効のアカウントラベルを含む2行のCSV
      const csvContent = `取引No,取引日,借方勘定科目,借方補助科目,借方部門,借方取引先,借方税区分,借方インボイス,借方金額,貸方勘定科目,貸方補助科目,貸方部門,貸方取引先,貸方税区分,貸方インボイス,貸方金額,摘要,仕訳メモ,タグ
1,2025/6/1,人件費,,,,,,1000,普通預金,,,,,,1000,給与支払,,
2,2025/6/2,無効な科目,,,,,,2000,普通預金,,,,,,2000,無効な取引,,`;

      const input: UploadMfCsvInput = {
        csvContent,
        politicalOrganizationId: "test-org-id",
      };

      const result = await usecase.execute(input);

      // バリデーションエラーが発生していることを確認
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("無効なアカウントラベルが見つかりました:");
      expect(result.errors[0]).toContain("無効な科目");

      // エラー詳細を確認
      const errorDetailMessages = result.errors.filter(msg => msg.includes("取引番号:"));
      expect(errorDetailMessages.length).toBeGreaterThan(0);
      expect(errorDetailMessages.some(msg => msg.includes("無効な科目"))).toBe(true);

      // Repositoryが呼び出されていないことを確認
      expect(mockRepository.createManySkipDuplicates).not.toHaveBeenCalled();

      // 処理したレコード数は2だが、保存されたレコード数は0
      expect(result.processedCount).toBe(2);
      expect(result.savedCount).toBe(0);
      expect(result.skippedCount).toBe(0);
    });
  });
});
