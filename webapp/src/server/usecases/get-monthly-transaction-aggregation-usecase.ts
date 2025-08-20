import type { IPoliticalOrganizationRepository } from "../repositories/interfaces/political-organization-repository.interface";
import type {
  ITransactionRepository,
  MonthlyAggregation,
} from "../repositories/interfaces/transaction-repository.interface";

export interface GetMonthlyTransactionAggregationParams {
  slug: string;
  financialYear: number;
}

export interface GetMonthlyTransactionAggregationResult {
  monthlyData: MonthlyAggregation[];
}

export class GetMonthlyTransactionAggregationUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private politicalOrganizationRepository: IPoliticalOrganizationRepository,
  ) {}

  async execute(
    params: GetMonthlyTransactionAggregationParams,
  ): Promise<GetMonthlyTransactionAggregationResult> {
    try {
      const politicalOrganization =
        await this.politicalOrganizationRepository.findBySlug(params.slug);

      if (!politicalOrganization) {
        throw new Error(
          `Political organization with slug "${params.slug}" not found`,
        );
      }

      const monthlyData = await this.transactionRepository.getMonthlyAggregation(
        politicalOrganization.id,
        params.financialYear,
      );

      return { monthlyData };
    } catch (error) {
      throw new Error(
        `Failed to get monthly transaction aggregation: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}