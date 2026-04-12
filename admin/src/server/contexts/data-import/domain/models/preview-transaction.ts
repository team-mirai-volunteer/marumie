import { createHash } from "crypto";
import type { TransactionType } from "@/shared/models/transaction";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/server/contexts/shared/domain/transaction";

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

/**
 * PreviewTransaction に関連するドメインロジック
 */
export const PreviewTransaction = {
  /**
   * トランザクションデータからハッシュ値を生成する
   * データ同一性の比較に使用される
   */
  generateHash: (transaction: PreviewTransaction): string => {
    const hashData = {
      transaction_no: transaction.transaction_no,
      transaction_date: normalizeDate(transaction.transaction_date),
      transaction_type: transaction.transaction_type || "",
      debit_account: transaction.debit_account,
      debit_sub_account: transaction.debit_sub_account || "",
      debit_amount: transaction.debit_amount,
      credit_account: transaction.credit_account,
      credit_sub_account: transaction.credit_sub_account || "",
      credit_amount: transaction.credit_amount,
      description: transaction.description || "",
      label: transaction.label || "",
      friendly_category: transaction.friendly_category || "",
      category_key: transaction.category_key || "",
    };

    const jsonString = JSON.stringify(hashData, Object.keys(hashData).sort());

    return createHash("sha256").update(jsonString, "utf8").digest("hex");
  },

  /**
   * 取引日から会計年度を算出する
   * 1月始まりの年度として計算
   */
  extractFinancialYear: (date: Date | string): number => {
    const startOfFinancialYear = 1;
    const d = ensureDate(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    return month >= startOfFinancialYear ? year : year - 1;
  },

  /**
   * PreviewTransaction を CreateTransactionInput に変換する
   */
  toCreateInput: (
    tx: PreviewTransaction,
    politicalOrganizationId: string,
  ): CreateTransactionInput => {
    if (tx.transaction_type === null) {
      throw new Error(`Invalid transaction type: ${tx.transaction_type}`);
    }

    const transactionDate = ensureDate(tx.transaction_date);

    return {
      political_organization_id: politicalOrganizationId,
      transaction_no: tx.transaction_no,
      transaction_date: transactionDate,
      financial_year: PreviewTransaction.extractFinancialYear(transactionDate),
      transaction_type: tx.transaction_type,
      debit_account: tx.debit_account,
      debit_sub_account: tx.debit_sub_account || "",
      debit_department: "",
      debit_partner: "",
      debit_tax_category: "",
      debit_amount: tx.debit_amount,
      credit_account: tx.credit_account,
      credit_sub_account: tx.credit_sub_account || "",
      credit_department: "",
      credit_partner: "",
      credit_tax_category: "",
      credit_amount: tx.credit_amount,
      description: tx.description || "",
      label: tx.label || "",
      friendly_category: tx.friendly_category || "",
      memo: "",
      category_key: tx.category_key,
      hash: tx.hash,
    };
  },

  /**
   * PreviewTransaction を UpdateTransactionInput に変換する
   */
  toUpdateInput: (tx: PreviewTransaction): UpdateTransactionInput => {
    if (tx.transaction_type === null) {
      throw new Error(`Invalid transaction type: ${tx.transaction_type}`);
    }

    const transactionDate = ensureDate(tx.transaction_date);

    return {
      transaction_no: tx.transaction_no,
      transaction_date: transactionDate,
      financial_year: PreviewTransaction.extractFinancialYear(transactionDate),
      transaction_type: tx.transaction_type,
      debit_account: tx.debit_account,
      debit_sub_account: tx.debit_sub_account || "",
      debit_department: "",
      debit_partner: "",
      debit_tax_category: "",
      debit_amount: tx.debit_amount,
      credit_account: tx.credit_account,
      credit_sub_account: tx.credit_sub_account || "",
      credit_department: "",
      credit_partner: "",
      credit_tax_category: "",
      credit_amount: tx.credit_amount,
      description: tx.description || "",
      label: tx.label || "",
      friendly_category: tx.friendly_category || "",
      memo: "",
      category_key: tx.category_key,
      hash: tx.hash,
    };
  },
} as const;

/**
 * Date | string を確実に Date オブジェクトに変換する。
 * サーバーアクション間のラウンドトリップで Date が文字列化されるケースに対応。
 */
function ensureDate(date: Date | string): Date {
  if (date instanceof Date) {
    if (Number.isNaN(date.getTime())) {
      throw new Error(`Invalid Date object: ${date}`);
    }
    return date;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date string: ${date}`);
  }
  return parsed;
}

/**
 * 日付を正規化してハッシュの一貫性を保つ
 */
function normalizeDate(date: Date | string): string {
  return ensureDate(date).toISOString().split("T")[0];
}
