import type { SankeyData } from "@/types/sankey";
import type { IPoliticalOrganizationRepository } from "../repositories/interfaces/political-organization-repository.interface";
import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";
import { convertCategoryAggregationToSankeyData } from "../utils/sankey-category-converter";

export interface GetSankeyAggregationParams {
  slug: string;
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
      const politicalOrganization =
        await this.politicalOrganizationRepository.findBySlug(params.slug);

      if (!politicalOrganization) {
        throw new Error(
          `Political organization with slug "${params.slug}" not found`,
        );
      }

      // 集計データを取得（フィルタなし、全データ）
      const aggregation = await this.transactionRepository.getCategoryAggregationForSankey(
        politicalOrganization.id
      );

      // Sankeyデータに変換
      const sankeyData = convertCategoryAggregationToSankeyData(aggregation);

      return { sankeyData };
    } catch (error) {
      throw new Error(
        `Failed to get sankey aggregation: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}