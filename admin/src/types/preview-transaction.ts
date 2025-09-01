// 統一されたTransactionType (DB保存時とPreview時で同じ型を使用)
export type TransactionType =
  | "income"
  | "expense"
  | "offset_income"
  | "offset_expense";
