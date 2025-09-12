import { ACCOUNT_CATEGORY_MAPPING } from "@/shared/utils/category-mapping";
import type { MfCsvRecord } from "./mf-csv-loader";

export interface ValidationError {
  record: MfCsvRecord;
  errors: string[];
  isDuplicate?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  invalidAccountLabels: string[];
  duplicateCount: number;
}

export class TransactionValidator {
  public validateRecords(
    records: MfCsvRecord[],
    existingTransactionNos: string[] = [],
  ): ValidationResult {
    const invalidAccountLabels = new Set<string>();
    const validAccountLabels = new Set(Object.keys(ACCOUNT_CATEGORY_MAPPING));
    validAccountLabels.add("普通預金");
    validAccountLabels.add("相殺項目（費用）");
    validAccountLabels.add("相殺項目（収入）");

    const existingTransactionNosSet = new Set(existingTransactionNos);

    const errors = records
      .map((record) =>
        this.validateRecord(
          record,
          validAccountLabels,
          invalidAccountLabels,
          existingTransactionNosSet,
        ),
      )
      .filter((error): error is ValidationError => error !== null);

    const duplicateCount = errors.filter((error) => error.isDuplicate).length;

    return {
      isValid: errors.length === 0,
      errors,
      invalidAccountLabels: Array.from(invalidAccountLabels),
      duplicateCount,
    };
  }

  private validateRecord(
    record: MfCsvRecord,
    validAccountLabels: Set<string>,
    invalidAccountLabels: Set<string>,
    existingTransactionNos: Set<string>,
  ): ValidationError | null {
    const recordErrors: string[] = [];
    const isDuplicate = existingTransactionNos.has(record.transaction_no);

    if (!validAccountLabels.has(record.debit_account)) {
      recordErrors.push(`無効な借方科目: "${record.debit_account}"`);
      invalidAccountLabels.add(record.debit_account);
    }

    if (!validAccountLabels.has(record.credit_account)) {
      recordErrors.push(`無効な貸方科目: "${record.credit_account}"`);
      invalidAccountLabels.add(record.credit_account);
    }

    if (!record.friendly_category || record.friendly_category.trim() === "") {
      recordErrors.push("独自のカテゴリが設定されていません");
    }

    if (isDuplicate) {
      recordErrors.push("重複データのためスキップされます");
    }

    return recordErrors.length > 0 || isDuplicate
      ? { record, errors: recordErrors, isDuplicate }
      : null;
  }
}
