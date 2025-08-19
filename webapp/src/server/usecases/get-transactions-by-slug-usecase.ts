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
  financialYear?: number;
}

export interface GetTransactionsBySlugResult {
  transactions: DisplayTransaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  politicalOrganization: PoliticalOrganization;
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
      if (params.financialYear) {
        filters.financial_year = params.financialYear;
      }

      const pagination: PaginationOptions = {
        page,
        perPage,
      };

      const result = await this.transactionRepository.findWithPagination(
        filters,
        pagination,
      );

      return {
        transactions: convertToDisplayTransactions(result.items),
        total: result.total,
        page: result.page,
        perPage: result.perPage,
        totalPages: result.totalPages,
        politicalOrganization,
      };
    } catch (error) {
      throw new Error(
        `Failed to get transactions by slug: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
