import { ACCOUNT_CATEGORY_MAPPING } from "@/shared/utils/category-mapping";
import type { PreviewTransaction } from "./mf-record-converter";

const REGULAR_DEPOSIT_ACCOUNT = "普通預金";
const OFFSET_EXPENSE_ACCOUNT = "相殺項目（費用）";
const OFFSET_INCOME_ACCOUNT = "相殺項目（収入）";

export class TransactionValidator {
  public validatePreviewTransactions(
    transactions: PreviewTransaction[],
    existingTransactionNos: string[] = [],
  ): PreviewTransaction[] {
    const existingTransactionNosSet = new Set(existingTransactionNos);

    return transactions.map((transaction) =>
      this.validateSingleTransaction(transaction, existingTransactionNosSet),
    );
  }

  private validateSingleTransaction(
    transaction: PreviewTransaction,
    existingTransactionNos: Set<string>,
  ): PreviewTransaction {
    // Check for duplicates first
    if (existingTransactionNos.has(transaction.transaction_no)) {
      return {
        ...transaction,
        status: "skip",
        errors: [...transaction.errors, "重複データのためスキップされます"],
      };
    }

    const errors: string[] = [];

    // Validate accounts
    const accountValidationErrors = this.validateAccounts(transaction);
    errors.push(...accountValidationErrors);

    // Validate friendly_category
    const categoryValidationError = this.validateFriendlyCategory(transaction);
    if (categoryValidationError) {
      errors.push(categoryValidationError);
    }

    // Determine final status based on validation results
    const status = errors.length > 0 ? "invalid" : transaction.status;

    return {
      ...transaction,
      status,
      errors: [...transaction.errors, ...errors],
    };
  }

  private validateAccounts(transaction: PreviewTransaction): string[] {
    const errors: string[] = [];
    const validAccountLabels = new Set([
      ...Object.keys(ACCOUNT_CATEGORY_MAPPING),
      REGULAR_DEPOSIT_ACCOUNT,
      OFFSET_EXPENSE_ACCOUNT,
      OFFSET_INCOME_ACCOUNT,
    ]);

    if (!validAccountLabels.has(transaction.debit_account)) {
      errors.push(`無効な借方科目: "${transaction.debit_account}"`);
    }

    if (!validAccountLabels.has(transaction.credit_account)) {
      errors.push(`無効な貸方科目: "${transaction.credit_account}"`);
    }

    return errors;
  }

  private validateFriendlyCategory(
    transaction: PreviewTransaction,
  ): string | null {
    const isOffsetTransaction =
      transaction.debit_account === OFFSET_EXPENSE_ACCOUNT ||
      transaction.credit_account === OFFSET_INCOME_ACCOUNT;

    if (
      !isOffsetTransaction &&
      (!transaction.friendly_category ||
        transaction.friendly_category.trim() === "")
    ) {
      return "独自のカテゴリが設定されていません";
    }

    return null;
  }
}
