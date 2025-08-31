import type { Transaction } from "@/shared/models/transaction";
import {
  ACCOUNT_CATEGORY_MAPPING,
  type CategoryMapping,
} from "@/shared/utils/category-mapping";
import type {
  DisplayTransaction,
  DisplayTransactionType,
} from "@/types/display-transaction";

/**
 * アカウント名からカテゴリマッピングを取得する関数
 * 存在しない場合は"unknown"を返す
 */
export function getCategoryMapping(account: string): CategoryMapping {
  return (
    ACCOUNT_CATEGORY_MAPPING[account] || {
      category: "unknown",
      subcategory: "unknown",
      color: "#99F6E4",
      shortLabel: "不明",
    }
  );
}

/**
 * Transaction を DisplayTransaction に変換する関数
 * offset系のTransactionTypeは型安全性によって除外される
 * @param transaction 元のTransactionオブジェクト（offset系以外）
 * @returns 表示用に変換されたDisplayTransactionオブジェクト
 */
export function convertToDisplayTransaction(
  transaction: Transaction & { transaction_type: DisplayTransactionType },
): DisplayTransaction {
  // 年月の生成 (例: "2025.08")
  const date = new Date(transaction.transaction_date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const yearmonth = `${year}.${month}`;

  // アカウント名の取得（支出の場合は借方勘定、収入の場合は貸方勘定を使用）
  const account =
    transaction.transaction_type === "expense"
      ? transaction.debit_account
      : transaction.credit_account;

  // カテゴリマッピングを取得
  const categoryMapping = getCategoryMapping(account);
  const category = categoryMapping.category;
  const subcategory = categoryMapping.subcategory;

  // 金額の計算
  const baseAmount =
    transaction.transaction_type === "expense"
      ? transaction.debit_amount
      : transaction.credit_amount;

  const absAmount = Math.abs(baseAmount);
  const amount =
    transaction.transaction_type === "expense" ? -absAmount : absAmount;

  return {
    id: transaction.id,
    date: transaction.transaction_date,
    yearmonth,
    transactionType: transaction.transaction_type,
    category,
    subcategory,
    label: account,
    shortLabel: categoryMapping.shortLabel,
    tags: transaction.tags,
    absAmount,
    amount,
  };
}

/**
 * Transaction配列をDisplayTransaction配列に変換する関数
 * offset系のTransactionは型安全性によって除外される
 */
export function convertToDisplayTransactions(
  transactions: (Transaction & { transaction_type: DisplayTransactionType })[],
): DisplayTransaction[] {
  return transactions.map(convertToDisplayTransaction);
}
