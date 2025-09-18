import type {
  CreateTransactionInput,
  Transaction,
  TransactionFilters,
  UpdateTransactionInput,
} from "@/shared/models/transaction";
import type { TransactionWithOrganization } from "@/shared/models/transaction";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PaginationOptions {
  page: number;
  perPage: number;
}

export interface ITransactionRepository {
  create(input: CreateTransactionInput): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  findWithPagination(
    filters?: TransactionFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<TransactionWithOrganization>>;
  update(id: string, input: UpdateTransactionInput): Promise<Transaction>;
  delete(id: string): Promise<void>;
  deleteAll(filters?: TransactionFilters): Promise<number>;
  createMany(inputs: CreateTransactionInput[]): Promise<Transaction[]>;
  createManySkipDuplicates(inputs: CreateTransactionInput[]): Promise<{
    created: Transaction[];
    skipped: number;
  }>;
  findByTransactionNos(transactionNos: string[]): Promise<Transaction[]>;
  checkDuplicateTransactionNos(
    politicalOrgId: string,
    transactionNos: string[],
  ): Promise<string[]>;
}
