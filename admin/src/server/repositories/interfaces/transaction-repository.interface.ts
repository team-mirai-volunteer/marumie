import {
  Transaction,
  TransactionType,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
} from '@/shared/model/transaction';

export interface ITransactionRepository {
  create(input: CreateTransactionInput): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  update(id: string, input: UpdateTransactionInput): Promise<Transaction>;
  delete(id: string): Promise<void>;
  createMany(inputs: CreateTransactionInput[]): Promise<Transaction[]>;
}