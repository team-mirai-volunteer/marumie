import type { PoliticalOrganization } from "@/shared/models/political-organization";
import type { TransactionFilters } from "@/shared/models/transaction";
import type { DisplayTransaction } from "@/types/display-transaction";
import type { IPoliticalOrganizationRepository } from "../repositories/interfaces/political-organization-repository.interface";
import type {
  ITransactionRepository,
  PaginationOptions,
} from "../repositories/interfaces/transaction-repository.interface";
import { convertToDisplayTransactions } from "../utils/transaction-converter";
import { ACCOUNT_CATEGORY_MAPPING } from "@/shared/utils/category-mapping";

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
  categories?: string[];
}

export interface GetTransactionsBySlugResult {
  transactions: DisplayTransaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  politicalOrganization: PoliticalOrganization;
  lastUpdatedAt: string | null;
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
      if (params.categories && params.categories.length > 0) {
        // Convert English keys to Japanese category names
        const categoryNames = params.categories
          .map((key) => {
            const mapping = Object.values(ACCOUNT_CATEGORY_MAPPING).find(
              (m) => m.key === key,
            );
            return mapping?.category;
          })
          .filter((name): name is string => Boolean(name));

        if (categoryNames.length > 0) {
          // For multiple categories, use the first one for now
          // TODO: Consider supporting multiple category filtering in the future
          filters.category_name = categoryNames[0];
        }
      }
      filters.financial_year = params.financialYear;

      const pagination: PaginationOptions = {
        page,
        perPage,
        sortBy: params.sortBy,
        order: params.order,
      };

      const [transactionResult, lastUpdatedAt] = await Promise.all([
        this.transactionRepository.findWithPagination(filters, pagination),
        this.transactionRepository.getLastUpdatedAt(),
      ]);

      const transactions = convertToDisplayTransactions(
        transactionResult.items,
      );
      const total = transactionResult.total;
      const totalPages = Math.ceil(total / perPage);

      return {
        transactions,
        total,
        page,
        perPage,
        totalPages,
        politicalOrganization,
        lastUpdatedAt: lastUpdatedAt?.toISOString() ?? null,
      };
    } catch (error) {
      throw new Error(
        `Failed to get transactions by slug: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
