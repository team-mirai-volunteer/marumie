export type TransactionType = '収入' | '支出' | 'それ以外';

export interface Transaction {
  id: string;
  transaction_no: string;
  transaction_date: string;
  transaction_type: TransactionType;
  debit_account: string;
  debit_sub_account: string;
  debit_department: string;
  debit_partner: string;
  debit_tax_category: string;
  debit_invoice: string;
  debit_amount: number;
  credit_account: string;
  credit_sub_account: string;
  credit_department: string;
  credit_partner: string;
  credit_tax_category: string;
  credit_invoice: string;
  credit_amount: number;
  description: string;
  tags: string;
  memo: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTransactionInput {
  transaction_no: string;
  transaction_date: string;
  transaction_type: TransactionType;
  debit_account: string;
  debit_sub_account: string;
  debit_department: string;
  debit_partner: string;
  debit_tax_category: string;
  debit_invoice: string;
  debit_amount: number;
  credit_account: string;
  credit_sub_account: string;
  credit_department: string;
  credit_partner: string;
  credit_tax_category: string;
  credit_invoice: string;
  credit_amount: number;
  description: string;
  tags: string;
  memo: string;
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {}

export interface TransactionFilters {
  transaction_type?: TransactionType;
  debit_account?: string;
  credit_account?: string;
  date_from?: string;
  date_to?: string;
}

export interface ITransactionRepository {
  create(input: CreateTransactionInput): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  update(id: string, input: UpdateTransactionInput): Promise<Transaction>;
  delete(id: string): Promise<void>;
  createMany(inputs: CreateTransactionInput[]): Promise<Transaction[]>;
}