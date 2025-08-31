import type { CreateTransactionInput } from "@/shared/models/transaction";
import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";
import {
  type PreviewTransaction,
  MfRecordConverter,
} from "../lib/mf-record-converter";
import { convertPreviewTypeToDbType } from "@/types/preview-transaction";

export interface SavePreviewTransactionsInput {
  validTransactions: PreviewTransaction[];
  politicalOrganizationId: string;
}

export interface SavePreviewTransactionsResult {
  processedCount: number;
  savedCount: number;
  skippedCount: number;
  errors: string[];
}

export class SavePreviewTransactionsUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private recordConverter: MfRecordConverter = new MfRecordConverter(),
  ) {}

  async execute(
    input: SavePreviewTransactionsInput,
  ): Promise<SavePreviewTransactionsResult> {
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

      const validTransactions = input.validTransactions.filter(
        (t) => t.status === "valid",
      );

      result.processedCount = input.validTransactions.length;
      result.skippedCount = input.validTransactions.filter(
        (t) => t.status === "skip",
      ).length;

      if (validTransactions.length === 0) {
        return result;
      }

      const transactionInputs: CreateTransactionInput[] = validTransactions.map(
        (transaction) =>
          this.convertPreviewToCreateInput(
            transaction,
            input.politicalOrganizationId,
          ),
      );

      const createResult =
        await this.transactionRepository.createMany(transactionInputs);
      result.savedCount = createResult.length;
    } catch (error) {
      console.error("Upload CSV error:", error);
      result.errors.push("データの保存中にエラーが発生しました");
    }

    return result;
  }

  private convertPreviewToCreateInput(
    previewTransaction: PreviewTransaction,
    politicalOrganizationId: string,
  ): CreateTransactionInput {
    // PreviewTransactionTypeをDbTransactionTypeに変換
    const dbTransactionType = convertPreviewTypeToDbType(
      previewTransaction.transaction_type,
    );
    if (!dbTransactionType) {
      throw new Error(
        `Invalid transaction type: ${previewTransaction.transaction_type}`,
      );
    }

    return {
      political_organization_id: politicalOrganizationId,
      transaction_no: previewTransaction.transaction_no,
      transaction_date: new Date(previewTransaction.transaction_date),
      financial_year: this.recordConverter.extractFinancialYear(
        typeof previewTransaction.transaction_date === "string"
          ? previewTransaction.transaction_date
          : previewTransaction.transaction_date.toISOString(),
      ),
      transaction_type: dbTransactionType,
      debit_account: previewTransaction.debit_account,
      debit_sub_account: previewTransaction.debit_sub_account || "",
      debit_department: "",
      debit_partner: "",
      debit_tax_category: "",
      debit_amount: previewTransaction.debit_amount,
      credit_account: previewTransaction.credit_account,
      credit_sub_account: previewTransaction.credit_sub_account || "",
      credit_department: "",
      credit_partner: "",
      credit_tax_category: "",
      credit_amount: previewTransaction.credit_amount,
      description: previewTransaction.description || "",
      description_1: previewTransaction.description_1,
      description_2: previewTransaction.description_2,
      description_3: previewTransaction.description_3,
      description_detail: undefined,
      tags: previewTransaction.tags || "",
      memo: "",
      category_key: previewTransaction.category_key,
    };
  }
}
