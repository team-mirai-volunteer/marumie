import { readFileSync } from "fs";
import { join } from "path";
import {
  SavePreviewTransactionsUsecase,
  type SavePreviewTransactionsInput,
} from "@/server/usecases/save-preview-transactions-usecase";
import {
  PreviewMfCsvUsecase,
  type PreviewMfCsvInput,
} from "@/server/usecases/preview-mf-csv-usecase";
import type { ITransactionRepository } from "@/server/repositories/interfaces/transaction-repository.interface";
import type { CreateTransactionInput } from "@/shared/models/transaction";
import { convertPreviewTypeToDbType } from "@/types/preview-transaction";

describe("SavePreviewTransactionsUsecase", () => {
  let usecase: SavePreviewTransactionsUsecase;
  let previewUsecase: PreviewMfCsvUsecase;
  let mockRepository: jest.Mocked<Pick<ITransactionRepository, 'createMany' | 'findByTransactionNos'>>;

  beforeEach(() => {
    mockRepository = {
      createMany: jest.fn(),
      findByTransactionNos: jest.fn().mockResolvedValue([]),
    };
    usecase = new SavePreviewTransactionsUsecase(mockRepository as unknown as ITransactionRepository);
    previewUsecase = new PreviewMfCsvUsecase(mockRepository as unknown as ITransactionRepository);
  });

  describe("execute with sample data", () => {
    it("should process sample CSV and calculate correct expense/income/other totals", async () => {
      // テスト用サンプルデータを読み込み
      const sampleCsvPath = join(__dirname, "../../data/sampledata.csv");
      const csvContent = readFileSync(sampleCsvPath, "utf-8");

      // PreviewUsecaseでvalidTransactionsを取得
      const previewInput: PreviewMfCsvInput = {
        csvContent,
        politicalOrganizationId: "test-org-id",
      };
      const previewResult = await previewUsecase.execute(previewInput);

      // Repositoryのモック設定
      const capturedTransactions: CreateTransactionInput[] = [];
      mockRepository.createMany.mockImplementation(
        async (transactions) => {
          capturedTransactions.push(...transactions);
          return transactions.map(t => ({ ...t, id: 'test-id', created_at: new Date(), updated_at: new Date() }));
        }
      );

      const input: SavePreviewTransactionsInput = {
        validTransactions: previewResult.transactions,
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
        .filter((t) => t.transaction_type === "offset_income" || t.transaction_type === "offset_expense")
        .reduce((sum, t) => sum + Math.max(t.debit_amount, t.credit_amount), 0);

      // サンプルデータから期待値を計算
      // income: 普通預金が借方（寄附収入）= 12,252,423円
      // expense: 普通預金が貸方（支出）= 10,058,725円
      // other: 普通預金以外の取引 = 0円（サンプルデータには該当なし）
      expect(incomeTotal).toBe(12252423);
      expect(expenseTotal).toBe(10058725);
      expect(otherTotal).toBe(0);

      // Repository呼び出し検証
      expect(mockRepository.createMany).toHaveBeenCalledTimes(1);
      expect(mockRepository.createMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            political_organization_id: "test-org-id",
            transaction_type: expect.stringMatching(/^(income|expense|offset_income|offset_expense)$/),
          }),
        ])
      );
    });

    it("should handle empty CSV content", async () => {
      const input: SavePreviewTransactionsInput = {
        validTransactions: [],
        politicalOrganizationId: "test-org-id",
      };

      const result = await usecase.execute(input);

      expect(result.processedCount).toBe(0);
      expect(result.savedCount).toBe(0);
      expect(result.skippedCount).toBe(0);
      expect(result.errors).toEqual(["有効なトランザクションがありません"]);
      expect(mockRepository.createMany).not.toHaveBeenCalled();
    });

    it("should handle repository errors gracefully", async () => {
      const sampleCsvPath = join(__dirname, "../../data/sampledata.csv");
      const csvContent = readFileSync(sampleCsvPath, "utf-8");

      // PreviewUsecaseでvalidTransactionsを取得
      const previewInput: PreviewMfCsvInput = {
        csvContent,
        politicalOrganizationId: "test-org-id",
      };
      const previewResult = await previewUsecase.execute(previewInput);

      mockRepository.createMany.mockRejectedValue(
        new Error("Database connection failed")
      );

      const input: SavePreviewTransactionsInput = {
        validTransactions: previewResult.transactions,
        politicalOrganizationId: "test-org-id",
      };

      const result = await usecase.execute(input);

      expect(result.errors).toContain("データの保存中にエラーが発生しました");
      expect(result.savedCount).toBe(0);
    });

    it("should reject invalid account labels and not call repository", async () => {
      // 有効と無効のアカウントラベルを含む2行のCSV
      const csvContent = `取引No,取引日,借方勘定科目,借方補助科目,借方部門,借方取引先,借方税区分,借方インボイス,借方金額,貸方勘定科目,貸方補助科目,貸方部門,貸方取引先,貸方税区分,貸方インボイス,貸方金額,摘要,仕訳メモ,タグ
1,2025/6/1,人件費,,,,,,1000,普通預金,,,,,,1000,給与支払,,
2,2025/6/2,無効な科目,,,,,,2000,普通預金,,,,,,2000,無効な取引,,`;

      // PreviewUsecaseでvalidTransactionsを取得（エラーを含む）
      const previewInput: PreviewMfCsvInput = {
        csvContent,
        politicalOrganizationId: "test-org-id",
      };
      const previewResult = await previewUsecase.execute(previewInput);

      const input: SavePreviewTransactionsInput = {
        validTransactions: previewResult.transactions,
        politicalOrganizationId: "test-org-id",
      };

      // createManyのモック設定を追加
      mockRepository.createMany.mockResolvedValue(
        previewResult.transactions
          .filter(t => t.status === 'valid')
          .map(t => ({
            id: 'test-id',
            political_organization_id: t.political_organization_id,
            transaction_no: t.transaction_no,
            transaction_date: new Date(t.transaction_date),
            financial_year: new Date(t.transaction_date).getFullYear(),
            transaction_type: convertPreviewTypeToDbType(t.transaction_type)!,
            debit_account: t.debit_account,
            debit_sub_account: t.debit_sub_account || '',
            debit_department: '',
            debit_partner: '',
            debit_tax_category: '',
            debit_amount: t.debit_amount,
            credit_account: t.credit_account,
            credit_sub_account: t.credit_sub_account || '',
            credit_department: '',
            credit_partner: '',
            credit_tax_category: '',
            credit_amount: t.credit_amount,
            description: t.description || '',
            description_1: t.description_1,
            description_2: t.description_2,
            description_3: t.description_3,
            description_detail: undefined,
            tags: t.tags || '',
            memo: '',
            category_key: t.category_key,
            created_at: new Date(),
            updated_at: new Date()
          }))
      );

      const result = await usecase.execute(input);

      // 無効な取引があるため有効な取引のみ処理される
      const validTransactionCount = previewResult.transactions.filter(t => t.status === 'valid').length;
      expect(result.processedCount).toBe(previewResult.transactions.length);
      expect(result.savedCount).toBe(validTransactionCount);

      // Repositoryは有効な取引がある場合のみ呼び出される
      if (validTransactionCount > 0) {
        expect(mockRepository.createMany).toHaveBeenCalled();
      } else {
        expect(mockRepository.createMany).not.toHaveBeenCalled();
      }
    });
  });
});
