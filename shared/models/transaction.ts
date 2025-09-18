// DB保存用のTransactionType (invalidは含まない)
export type TransactionType =
  | "income"
  | "expense"
  | "offset_income"
  | "offset_expense";

export interface Transaction {
  id: string;
  political_organization_id: string;
  transaction_no: string;
  transaction_date: Date;
  financial_year: number;
  transaction_type: TransactionType;
  debit_account: string;
  debit_sub_account?: string;
  debit_department?: string;
  debit_partner?: string;
  debit_tax_category?: string;
  debit_amount: number;
  credit_account: string;
  credit_sub_account?: string;
  credit_department?: string;
  credit_partner?: string;
  credit_tax_category?: string;
  credit_amount: number;
  description?: string;
  friendly_category: string;
  memo?: string;
  category_key: string;
  label: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTransactionInput {
  political_organization_id: string;
  transaction_no: string;
  transaction_date: Date;
  financial_year: number;
  transaction_type: TransactionType;
  debit_account: string;
  debit_sub_account?: string;
  debit_department?: string;
  debit_partner?: string;
  debit_tax_category?: string;
  debit_amount: number;
  credit_account: string;
  credit_sub_account?: string;
  credit_department?: string;
  credit_partner?: string;
  credit_tax_category?: string;
  credit_amount: number;
  description?: string;
  friendly_category: string;
  memo?: string;
  category_key: string;
  label?: string;
}

export interface UpdateTransactionInput
  extends Partial<CreateTransactionInput> {}

export interface TransactionFilters {
  political_organization_id?: string;
  political_organization_ids?: string[];
  transaction_type?: TransactionType;
  debit_account?: string;
  credit_account?: string;
  date_from?: Date;
  date_to?: Date;
  financial_year?: number;
  category_keys?: string[];
}

export interface TransactionWithOrganization extends Transaction {
  political_organization_name?: string;
}
