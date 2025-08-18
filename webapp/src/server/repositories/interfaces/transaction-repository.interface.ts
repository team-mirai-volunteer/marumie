import type {
  Transaction,
  TransactionFilters,
} from "@/shared/models/transaction";

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
  findById(id: string): Promise<Transaction | null>;
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  findWithPagination(
    filters?: TransactionFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Transaction>>;
}