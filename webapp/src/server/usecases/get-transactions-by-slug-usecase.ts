import type { PoliticalOrganization } from "@/shared/models/political-organization";
import type { TransactionFilters } from "@/shared/models/transaction";
import type { DisplayTransaction } from "@/types/display-transaction";
import type { IPoliticalOrganizationRepository } from "../repositories/interfaces/political-organization-repository.interface";
import type {
  ITransactionRepository,
  PaginationOptions,
} from "../repositories/interfaces/transaction-repository.interface";
import { convertToDisplayTransactions } from "../utils/transaction-converter";

export interface GetTransactionsBySlugParams {
  slug: string;
  page?: number;
  perPage?: number;
  transactionType?: "income" | "expense" | "other";
  dateFrom?: Date;
  dateTo?: Date;
  financialYear: number;
  sortBy?: "date" | "amount";
  order?: "asc" | "desc";
  categoryName?: string;
}

export interface GetTransactionsBySlugResult {
  transactions: DisplayTransaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  politicalOrganization: PoliticalOrganization;
  lastUpdatedAt: Date | null;
}

export class GetTransactionsBySlugUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private politicalOrganizationRepository: IPoliticalOrganizationRepository,
  ) {}

  async execute(
    params: GetTransactionsBySlugParams,
  ): Promise<GetTransactionsBySlugResult> {
    try {
      const politicalOrganization =
        await this.politicalOrganizationRepository.findBySlug(params.slug);

      if (!politicalOrganization) {
        throw new Error(
          `Political organization with slug "${params.slug}" not found`,
        );
      }

      const page = Math.max(params.page || 1, 1);
      const perPage = Math.min(Math.max(params.perPage || 50, 1), 100);

      const filters: TransactionFilters = {
        political_organization_id: politicalOrganization.id,
      };

      if (params.transactionType) {
        filters.transaction_type = params.transactionType;
      }
      if (params.dateFrom) {
        filters.date_from = params.dateFrom;
      }
      if (params.dateTo) {
        filters.date_to = params.dateTo;
      }
      if (params.categoryName) {
        filters.category_name = params.categoryName;
      }
      filters.financial_year = params.financialYear;

      let transactions: DisplayTransaction[];
      let total: number;

      const [transactionResult, lastUpdatedAt] = await Promise.all([
        (async () => {
          if (params.sortBy === "amount") {
            // For amount sorting, get ALL data first, then sort and paginate
            const allTransactions =
              await this.transactionRepository.findAll(filters);
            const allDisplayTransactions =
              convertToDisplayTransactions(allTransactions);

            // Sort all transactions by amount
            allDisplayTransactions.sort((a, b) => {
              const order = params.order === "asc" ? 1 : -1;
              return (a.amount - b.amount) * order;
            });

            // Apply pagination after sorting
            const totalCount = allDisplayTransactions.length;
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;
            return {
              transactions: allDisplayTransactions.slice(startIndex, endIndex),
              total: totalCount,
            };
          } else {
            // For date sorting or no sorting, use database-level pagination
            const pagination: PaginationOptions = {
              page,
              perPage,
              sortBy: params.sortBy,
              order: params.order,
            };

            const result = await this.transactionRepository.findWithPagination(
              filters,
              pagination,
            );

            return {
              transactions: convertToDisplayTransactions(result.items),
              total: result.total,
            };
          }
        })(),
        this.transactionRepository.getLastUpdatedAt(),
      ]);

      transactions = transactionResult.transactions;
      total = transactionResult.total;
      const totalPages = Math.ceil(total / perPage);

      return {
        transactions,
        total,
        page,
        perPage,
        totalPages,
        politicalOrganization,
        lastUpdatedAt,
      };
    } catch (error) {
      throw new Error(
        `Failed to get transactions by slug: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
