import type { MfCsvRecord } from "./mf-csv-loader";
import {
  ACCOUNT_CATEGORY_MAPPING,
  ACCRUED_EXPENSE_MAPPING,
} from "@/shared/utils/category-mapping";
import type { TransactionType } from "@/shared/models/transaction";
import { generateTransactionHash } from "./transaction-hash";

export interface PreviewTransaction {
  political_organization_id: string;
  transaction_no: string;
  transaction_date: Date | string;
  transaction_type: TransactionType | null;
  debit_account: string;
  debit_sub_account: string | undefined;
  debit_amount: number;
  credit_account: string;
  credit_sub_account: string | undefined;
  credit_amount: number;
  description: string | undefined;
  label: string | undefined;
  friendly_category: string;
  category_key: string;
  hash: string;
  status: "insert" | "update" | "invalid" | "skip";
  errors: string[];
  existingTransactionId?: string;
}

export class MfRecordConverter {
  public convertRow(
    record: MfCsvRecord,
    politicalOrganizationId: string,
  ): PreviewTransaction {
    const debitAmount = this.parseAmount(record.debit_amount);
    const creditAmount = this.parseAmount(record.credit_amount);
    const categoryKey = this.determineCategoryKey(
      record.debit_account,
      record.credit_account,
    );
    const transactionType = this.determineTransactionType(
      record.debit_account,
      record.credit_account,
    );

    const label = record.description?.startsWith("デビット")
      ? record.description
      : undefined;

    // Determine status and errors based on conversion
    let status: "insert" | "update" | "invalid" | "skip" = "insert";
    let errors: string[] = [];

    if (transactionType === null) {
      status = "invalid";
      errors = [
        `Invalid account combination: debit=${record.debit_account}, credit=${record.credit_account}`,
      ];
    }

    // Parse transaction date with validation
    const { date: transactionDate, isValid: isDateValid } =
      this.parseTransactionDate(record.transaction_date);
    if (!isDateValid) {
      status = "invalid";
      errors.push(`Invalid date format: ${record.transaction_date}`);
    }

    const transaction = {
      political_organization_id: politicalOrganizationId,
      transaction_no: record.transaction_no,
      transaction_date: transactionDate,
      transaction_type: transactionType,
      debit_account: record.debit_account,
      debit_sub_account: record.debit_sub_account,
      debit_amount: debitAmount,
      credit_account: record.credit_account,
      credit_sub_account: record.credit_sub_account,
      credit_amount: creditAmount,
      description: record.description,
      label: label,
      friendly_category: record.friendly_category,
      category_key: categoryKey,
      hash: "",
      status,
      errors,
    };

    // hash値を計算して設定
    transaction.hash = generateTransactionHash(transaction);

    return transaction;
  }

  private parseTransactionDate(dateStr: string): {
    date: Date;
    isValid: boolean;
  } {
    try {
      const date = new Date(dateStr);
      if (Number.isNaN(date.getTime())) {
        return { date: new Date("1970-01-01"), isValid: false };
      }
      return { date, isValid: true };
    } catch (_error) {
      return { date: new Date("1970-01-01"), isValid: false };
    }
  }

  private parseAmount(amountStr: string): number {
    if (!amountStr || amountStr.trim() === "") {
      return 0;
    }

    const cleaned = amountStr.replace(/[,\s]/g, "");
    const parsed = parseInt(cleaned, 10);

    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private determineCategoryKey(
    debitAccount: string,
    creditAccount: string,
  ): string {
    if (debitAccount === "普通預金") {
      const mapping =
        ACCOUNT_CATEGORY_MAPPING[creditAccount] ||
        ACCRUED_EXPENSE_MAPPING[creditAccount];
      return mapping ? mapping.key : "undefined";
    } else if (creditAccount === "普通預金") {
      const mapping =
        ACCOUNT_CATEGORY_MAPPING[debitAccount] ||
        ACCRUED_EXPENSE_MAPPING[debitAccount];
      return mapping ? mapping.key : "undefined";
    } else {
      return "undefined";
    }
  }

  private determineTransactionType(
    debitAccount: string,
    creditAccount: string,
  ): TransactionType | null {
    if (debitAccount === "相殺項目（費用）") {
      return "offset_expense";
    }
    if (creditAccount === "相殺項目（収入）") {
      return "offset_income";
    }
    if (debitAccount === "普通預金") {
      return "income";
    }
    if (creditAccount === "普通預金") {
      return "expense";
    }
    return null;
  }

  public extractFinancialYear(dateString: string): number {
    const startOfFinancialYear = 1;

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return month >= startOfFinancialYear ? year : year - 1;
  }
}
