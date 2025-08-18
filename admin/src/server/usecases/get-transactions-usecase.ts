import { Transaction, TransactionFilters } from '@/shared/model/transaction';
import { ITransactionRepository } from '../repositories/interfaces/transaction-repository.interface';

export interface GetTransactionsParams {
  page?: number;
  perPage?: number;
  politicalOrganizationId?: string;
  transactionType?: 'income' | 'expense' | 'other';
  dateFrom?: Date;
  dateTo?: Date;
  financialYear?: number;
}

export interface GetTransactionsResult {
  transactions: Transaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export class GetTransactionsUsecase {
  constructor(private repository: ITransactionRepository) {}

  async execute(params: GetTransactionsParams = {}): Promise<GetTransactionsResult> {
    try {
      const page = Math.max(params.page || 1, 1);
      const perPage = Math.min(Math.max(params.perPage || 50, 1), 100);

      const filters: TransactionFilters = {};
      if (params.politicalOrganizationId) {
        filters.political_organization_id = params.politicalOrganizationId;
      }
      if (params.transactionType) {
        filters.transaction_type = params.transactionType;
      }
      if (params.dateFrom) {
        filters.date_from = params.dateFrom;
      }
      if (params.dateTo) {
        filters.date_to = params.dateTo;
      }
      if (params.financialYear) {
        filters.financial_year = params.financialYear;
      }

      const transactions = await this.repository.findAll(filters);
      const total = transactions.length;

      const skip = (page - 1) * perPage;
      const paginatedTransactions = transactions.slice(skip, skip + perPage);
      const totalPages = Math.ceil(total / perPage);

      return {
        transactions: paginatedTransactions,
        total,
        page,
        perPage,
        totalPages,
      };
    } catch (error) {
      throw new Error(`Failed to get transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}