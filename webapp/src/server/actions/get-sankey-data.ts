import "server-only";

import { PrismaClient } from "@prisma/client";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import { GetSankeyAggregationUsecase } from "@/server/usecases/get-sankey-aggregation-usecase";
import type { SankeyData } from "@/types/sankey";

const prisma = new PrismaClient();

interface GetSankeyDataParams {
  slug: string;
}

export async function getSankeyData(
  params: GetSankeyDataParams,
): Promise<SankeyData | null> {
  try {
    // 依存関係の初期化
    const transactionRepository = new PrismaTransactionRepository(prisma);
    const politicalOrganizationRepository =
      new PrismaPoliticalOrganizationRepository(prisma);

    // 軽量な集計ベースのUsecase
    const getSankeyAggregationUsecase = new GetSankeyAggregationUsecase(
      transactionRepository,
      politicalOrganizationRepository,
    );

    // 集計クエリを実行してSankeyデータを取得（slugのみ）
    const result = await getSankeyAggregationUsecase.execute({
      slug: params.slug,
    });

    return result.sankeyData;
  } catch (error) {
    console.error("Error fetching sankey data:", error);
    return null;
  }
}
