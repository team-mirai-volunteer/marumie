// Preview段階で使用するTransactionType (invalidを含む5つの値)
export type PreviewTransactionType =
  | "income"
  | "expense"
  | "offset_income"
  | "offset_expense"
  | "invalid";

// DB保存時に使用するTransactionType (invalidを除く4つの値)
export type DbTransactionType =
  | "income"
  | "expense"
  | "offset_income"
  | "offset_expense";

// PreviewTransactionTypeをDbTransactionTypeに変換する関数
export function convertPreviewTypeToDbType(
  previewType: PreviewTransactionType,
): DbTransactionType | null {
  if (previewType === "invalid") {
    return null; // invalidは変換できない
  }
  return previewType as DbTransactionType;
}

// DbTransactionTypeがPreviewTransactionTypeの有効な値かチェック
export function isValidDbTransactionType(
  type: string,
): type is DbTransactionType {
  return ["income", "expense", "offset_income", "offset_expense"].includes(
    type,
  );
}

// PreviewTransactionTypeの有効な値かチェック
export function isValidPreviewTransactionType(
  type: string,
): type is PreviewTransactionType {
  return [
    "income",
    "expense",
    "offset_income",
    "offset_expense",
    "invalid",
  ].includes(type);
}
