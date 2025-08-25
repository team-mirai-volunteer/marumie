export type TransactionType = "income" | "expense" | "other";

export interface DisplayTransaction {
  id: string; // 元のTransaction IDをそのまま利用
  date: Date; // 日付（フィルタリングしやすいよう元のDate型を維持）
  yearmonth: string; // 年月 (例: "2025.08")
  transactionType: TransactionType; // 'income' | 'expense' | 'other'
  category: string; // 表示用カテゴリ名
  subcategory?: string; // サブカテゴリ（任意）
  label: string; // 元のアカウント名（debit_account または credit_account）
  shortLabel: string; // 表示用短縮ラベル（Figmaデザイン準拠）
  tags?: string; // タグ情報をそのまま保持
  absAmount: number; // 金額（絶対値）
  amount: number; // 金額（支出時はマイナス値）
}
