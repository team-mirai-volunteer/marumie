"use server";

import { PrismaClient } from "@prisma/client";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import { GetMonthlyTransactionAggregationUsecase } from "@/server/usecases/get-monthly-transaction-aggregation-usecase";
import { GetSankeyAggregationUsecase } from "@/server/usecases/get-sankey-aggregation-usecase";
import {
  type GetTransactionsBySlugParams,
  GetTransactionsBySlugUsecase,
} from "@/server/usecases/get-transactions-by-slug-usecase";

const prisma = new PrismaClient();

export interface GetTransactionPageDataParams
  extends Omit<GetTransactionsBySlugParams, "financialYear"> {
  financialYear: number; // 必須項目として設定
}

export async function getTransactionPageDataAction(
  params: GetTransactionPageDataParams,
) {
  const transactionRepository = new PrismaTransactionRepository(prisma);
  const politicalOrganizationRepository =
    new PrismaPoliticalOrganizationRepository(prisma);

  // 3つのUsecaseを初期化
  const transactionUsecase = new GetTransactionsBySlugUsecase(
    transactionRepository,
    politicalOrganizationRepository,
  );

  const monthlyUsecase = new GetMonthlyTransactionAggregationUsecase(
    transactionRepository,
    politicalOrganizationRepository,
  );

  const sankeyUsecase = new GetSankeyAggregationUsecase(
    transactionRepository,
    politicalOrganizationRepository,
  );

  // 3つのUsecaseを並列実行
  const [transactionData, monthlyData, sankeyData] = await Promise.all([
    transactionUsecase.execute(params),
    monthlyUsecase.execute({
      slug: params.slug,
      financialYear: params.financialYear,
    }),
    sankeyUsecase.execute({
      slug: params.slug,
      financialYear: params.financialYear,
    }),
  ]);

  return {
    transactionData,
    monthlyData: monthlyData.monthlyData,
    sankeyData: sankeyData.sankeyData,
  };
}
