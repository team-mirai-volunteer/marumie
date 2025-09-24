import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";
import type { IPoliticalOrganizationRepository } from "../repositories/interfaces/political-organization-repository.interface";
import { UNREALIZED_EXPENSES_CATEGORIES } from "@/shared/utils/category-mapping";

export interface GetUnrealizedExpensesParams {
  slugs: string[];
  financialYear: number;
}

export interface GetUnrealizedExpensesResult {
  unrealizedExpenses: Array<{
    category: string;
    subcategory?: string;
    totalAmount: number;
  }>;
}

export class GetUnrealizedExpensesUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private politicalOrganizationRepository: IPoliticalOrganizationRepository,
  ) {}

  async execute(
    params: GetUnrealizedExpensesParams,
  ): Promise<GetUnrealizedExpensesResult> {
    try {
      const politicalOrganizations =
        await this.politicalOrganizationRepository.findBySlugs(params.slugs);

      if (politicalOrganizations.length === 0) {
        throw new Error(
          `Political organizations with slugs "${params.slugs.join(", ")}" not found`,
        );
      }

      const organizationIds = politicalOrganizations.map((org) => org.id);
      const aggregatedResult =
        await this.transactionRepository.getCategoryAggregationForSankey(
          organizationIds,
          params.financialYear,
          "political-category",
        );

      const unrealizedExpenses = aggregatedResult.expense.filter((item) =>
        Object.keys(UNREALIZED_EXPENSES_CATEGORIES).includes(item.category),
      );

      return { unrealizedExpenses };
    } catch (error) {
      throw new Error(
        `Failed to get unrealized expenses: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
