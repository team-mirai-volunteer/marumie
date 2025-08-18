import {
  Transaction,
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
  deleteAll(filters?: TransactionFilters): Promise<number>;
  createMany(inputs: CreateTransactionInput[]): Promise<Transaction[]>;
  createManySkipDuplicates(inputs: CreateTransactionInput[]): Promise<{
    created: Transaction[];
    skipped: number;
  }>;
}
