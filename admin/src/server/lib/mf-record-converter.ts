import type { MfCsvRecord } from "./mf-csv-loader";
import { ACCOUNT_CATEGORY_MAPPING } from "@/shared/utils/category-mapping";
import type { TransactionType } from "@/shared/models/transaction";

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
  friendly_category: string | undefined;
  category_key: string;
  status: "valid" | "invalid" | "skip";
  errors: string[];
  skipReason?: string;
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

    const label = this.determineLabel(
      record.description,
      record.debit_account,
      record.credit_account,
    );

    return {
      political_organization_id: politicalOrganizationId,
      transaction_no: record.transaction_no,
      transaction_date: new Date(record.transaction_date),
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
      status: transactionType === null ? "invalid" : "valid",
      errors:
        transactionType === null
          ? [
              `Invalid account combination: debit=${record.debit_account}, credit=${record.credit_account}`,
            ]
          : [],
    };
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
      const mapping = ACCOUNT_CATEGORY_MAPPING[creditAccount];
      return mapping ? mapping.key : "undefined";
    } else if (creditAccount === "普通預金") {
      const mapping = ACCOUNT_CATEGORY_MAPPING[debitAccount];
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

  private determineLabel(
    description: string | undefined,
    debitAccount: string,
    creditAccount: string,
  ): string | undefined {
    if (!description) {
      return undefined;
    }

    // 収入項目が「個人からの寄附」の場合はlabelを設定しない
    if (debitAccount === "普通預金" && creditAccount === "個人からの寄附") {
      return undefined;
    }

    // 支出項目が「人件費」の場合はlabelを設定しない
    if (creditAccount === "普通預金" && debitAccount === "人件費") {
      return undefined;
    }

    // それ以外の場合はdescriptionをlabelとして使用
    return description;
  }

  public extractFinancialYear(dateString: string): number {
    const startOfFinancialYear = 1;

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return month >= startOfFinancialYear ? year : year - 1;
  }
}
