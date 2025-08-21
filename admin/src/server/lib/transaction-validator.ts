import { ACCOUNT_CATEGORY_MAPPING } from "@/shared/utils/category-mapping";
import type { MfCsvRecord } from "./mf-csv-loader";

export interface ValidationError {
  record: MfCsvRecord;
  errors: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  invalidAccountLabels: string[];
}

export class TransactionValidator {
  public validateRecords(records: MfCsvRecord[]): ValidationResult {
    const errors: ValidationError[] = [];
    const invalidAccountLabels = new Set<string>();
    const validAccountLabels = new Set(Object.keys(ACCOUNT_CATEGORY_MAPPING));
    validAccountLabels.add("普通預金");

    for (const record of records) {
      const recordErrors: string[] = [];

      if (!validAccountLabels.has(record.debit_account)) {
        recordErrors.push(`無効な借方科目: "${record.debit_account}"`);
        invalidAccountLabels.add(record.debit_account);
      }

      if (!validAccountLabels.has(record.credit_account)) {
        recordErrors.push(`無効な貸方科目: "${record.credit_account}"`);
        invalidAccountLabels.add(record.credit_account);
      }

      if (recordErrors.length > 0) {
        errors.push({
          record,
          errors: recordErrors,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      invalidAccountLabels: Array.from(invalidAccountLabels),
    };
  }
}
