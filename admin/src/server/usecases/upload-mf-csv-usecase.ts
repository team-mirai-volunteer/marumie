import type { CreateTransactionInput } from "@/shared/models/transaction";
import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";
import type { PreviewTransaction } from "./preview-mf-csv-usecase";
import { ACCOUNT_CATEGORY_MAPPING } from "@/shared/utils/category-mapping";

export interface UploadMfCsvInput {
  validTransactions: PreviewTransaction[];
  politicalOrganizationId: string;
}

export interface UploadMfCsvResult {
  processedCount: number;
  savedCount: number;
  skippedCount: number;
  errors: string[];
}

export class UploadMfCsvUsecase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(input: UploadMfCsvInput): Promise<UploadMfCsvResult> {
    const result: UploadMfCsvResult = {
      processedCount: 0,
      savedCount: 0,
      skippedCount: 0,
      errors: [],
    };

    try {
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      result.errors.push(errorMessage);
    }

    return result;
  }

  private convertPreviewToCreateInput(
    previewTransaction: PreviewTransaction,
    politicalOrganizationId: string,
  ): CreateTransactionInput {
    return {
      political_organization_id: politicalOrganizationId,
      transaction_no: previewTransaction.transaction_no,
      transaction_date: new Date(previewTransaction.transaction_date),
      financial_year: this.extractFinancialYear(
        new Date(previewTransaction.transaction_date),
      ),
      transaction_type: this.determineTransactionType(
        previewTransaction.debit_account,
        previewTransaction.credit_account,
      ),
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
      description_1: this.splitDescription(previewTransaction.description || "")
        .description_1,
      description_2: this.splitDescription(previewTransaction.description || "")
        .description_2,
      description_3: this.splitDescription(previewTransaction.description || "")
        .description_3,
      description_detail: undefined,
      tags: previewTransaction.tags || "",
      memo: "",
      category_key: this.determineCategoryKey(
        previewTransaction.debit_account,
        previewTransaction.credit_account,
      ),
    };
  }

  private extractFinancialYear(date: Date): number {
    const startOfFinancialYear = 4;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return month >= startOfFinancialYear ? year : year - 1;
  }

  private determineTransactionType(
    debitAccount: string,
    creditAccount: string,
  ): "income" | "expense" | "other" {
    if (debitAccount === "普通預金") {
      return "income";
    } else if (creditAccount === "普通預金") {
      return "expense";
    } else {
      return "other";
    }
  }

  private determineCategoryKey(
    debitAccount: string,
    creditAccount: string,
  ): string {
    // incomeの場合：貸方（credit）のアカウントがカテゴリ
    if (debitAccount === "普通預金") {
      const mapping = ACCOUNT_CATEGORY_MAPPING[creditAccount];
      return mapping ? mapping.key : "undefined";
    }
    // expenseの場合：借方（debit）のアカウントがカテゴリ
    else if (creditAccount === "普通預金") {
      const mapping = ACCOUNT_CATEGORY_MAPPING[debitAccount];
      return mapping ? mapping.key : "undefined";
    }
    // その他の場合はデフォルト
    else {
      return "undefined";
    }
  }

  private splitDescription(description: string): {
    description_1?: string;
    description_2?: string;
    description_3?: string;
  } {
    if (!description || description.trim() === "") {
      return {};
    }

    const parts = description.trim().split(/\s+/);

    switch (parts.length) {
      case 1:
        return { description_1: parts[0] };
      case 2:
        return { description_1: parts[0], description_3: parts[1] };
      case 3:
        return {
          description_1: parts[0],
          description_2: parts[1],
          description_3: parts[2],
        };
      default:
        return {
          description_1: parts[0],
          description_2: parts[1],
          description_3: parts.slice(2).join(" "),
        };
    }
  }
}
