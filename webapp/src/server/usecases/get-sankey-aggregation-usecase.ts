import type { SankeyData } from "@/types/sankey";
import type { IPoliticalOrganizationRepository } from "../repositories/interfaces/political-organization-repository.interface";
import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";
import { convertCategoryAggregationToSankeyData } from "../utils/sankey-category-converter";

export interface GetSankeyAggregationParams {
  slugs: string[];
  financialYear: number;
  categoryType?: "political-category" | "friendly-category";
}

export interface GetSankeyAggregationResult {
  sankeyData: SankeyData;
}

export class GetSankeyAggregationUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private politicalOrganizationRepository: IPoliticalOrganizationRepository,
  ) {}

  async execute(
    params: GetSankeyAggregationParams,
  ): Promise<GetSankeyAggregationResult> {
    try {
      // 政治団体を取得
      const politicalOrganizations =
        await this.politicalOrganizationRepository.findBySlugs(params.slugs);

      if (politicalOrganizations.length === 0) {
        throw new Error(
          `Political organizations with slugs "${params.slugs.join(", ")}" not found`,
        );
      }

      // 集計データを取得（IN句で効率的に）
      const organizationIds = politicalOrganizations.map((org) => org.id);
      const aggregatedResult =
        await this.transactionRepository.getCategoryAggregationForSankey(
          organizationIds,
          params.financialYear,
          params.categoryType,
        );

      // Sankeyデータに変換
      const isFriendlyCategory = params.categoryType === "friendly-category";
      const sankeyData = convertCategoryAggregationToSankeyData(
        aggregatedResult,
        isFriendlyCategory,
      );

      return { sankeyData };
    } catch (error) {
      throw new Error(
        `Failed to get sankey aggregation: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
