import type { MfCsvRecord } from "./mf-csv-loader";
import { ACCOUNT_CATEGORY_MAPPING } from "@/shared/utils/category-mapping";
import type { TransactionType } from "@/shared/models/transaction";

export interface PreviewTransaction {
  political_organization_id: string;
  transaction_no: string;
  transaction_date: Date | string;
  transaction_type: TransactionType;
  debit_account: string;
  debit_sub_account: string | undefined;
  debit_amount: number;
  credit_account: string;
  credit_sub_account: string | undefined;
  credit_amount: number;
  description: string | undefined;
  description_1: string | undefined;
  description_2: string | undefined;
  description_3: string | undefined;
  tags: string | undefined;
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
    const descriptionParts = this.splitDescription(record.description);
    const categoryKey = this.determineCategoryKey(
      record.debit_account,
      record.credit_account,
    );
    const transactionType = this.determineTransactionType(
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
      description_1: descriptionParts.description_1,
      description_2: descriptionParts.description_2,
      description_3: descriptionParts.description_3,
      tags: record.tags,
      category_key: categoryKey,
      status: "valid",
      errors: [],
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

  private determineTransactionType(
    debitAccount: string,
    creditAccount: string,
  ): TransactionType {
    if (debitAccount === "普通預金") {
      return "income";
    } else if (creditAccount === "普通預金") {
      return "expense";
    } else {
      return "other";
    }
  }

  public extractFinancialYear(dateString: string): number {
    const startOfFinancialYear = 4;

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return month >= startOfFinancialYear ? year : year - 1;
  }
}
