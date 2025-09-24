import type { PoliticalOrganization } from "@/shared/models/political-organization";
import type { TransactionFilters } from "@/types/transaction-filters";
import type { DisplayTransaction } from "@/types/display-transaction";
import type { IPoliticalOrganizationRepository } from "../repositories/interfaces/political-organization-repository.interface";
import type {
  ITransactionRepository,
  PaginationOptions,
} from "../repositories/interfaces/transaction-repository.interface";
import { convertToDisplayTransactions } from "../utils/transaction-converter";
import { ACCRUED_EXPENSES_CATEGORIES } from "@/shared/utils/category-mapping";

export interface GetAccruedExpensesParams {
  slugs: string[];
  page?: number;
  perPage?: number;
  dateFrom?: Date;
  dateTo?: Date;
  financialYear: number;
  sortBy?: "date" | "amount";
  order?: "asc" | "desc";
}

export interface GetAccruedExpensesResult {
  transactions: DisplayTransaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  politicalOrganizations: PoliticalOrganization[];
  lastUpdatedAt: string | null;
}

export class GetAccruedExpensesUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private politicalOrganizationRepository: IPoliticalOrganizationRepository,
  ) {}

  async execute(
    params: GetAccruedExpensesParams,
  ): Promise<GetAccruedExpensesResult> {
    try {
      const politicalOrganizations =
        await this.politicalOrganizationRepository.findBySlugs(params.slugs);

      if (politicalOrganizations.length === 0) {
        throw new Error(
          `Political organizations with slugs "${params.slugs.join(", ")}" not found`,
        );
      }

      const page = Math.max(params.page || 1, 1);
      const perPage = Math.min(Math.max(params.perPage || 50, 1), 100);

      const organizationIds = politicalOrganizations.map((org) => org.id);
      const filters: TransactionFilters = {
        political_organization_ids: organizationIds,
      };

      // Filter for accrued expenses categories only
      const accruedExpensesCategoryKeys = Object.values(
        ACCRUED_EXPENSES_CATEGORIES,
      ).map((mapping) => mapping.key);
      filters.category_keys = accruedExpensesCategoryKeys;

      if (params.dateFrom) {
        filters.date_from = params.dateFrom;
      }
      if (params.dateTo) {
        filters.date_to = params.dateTo;
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
        politicalOrganizations,
        lastUpdatedAt: lastUpdatedAt?.toISOString() ?? null,
      };
    } catch (error) {
      throw new Error(
        `Failed to get accrued expenses: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
