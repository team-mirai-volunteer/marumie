"use server";

import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import { GetDailyDonationUsecase } from "@/server/usecases/get-daily-donation-usecase";
import { GetMockTransactionPageDataUsecase } from "@/server/usecases/get-mock-transaction-page-data-usecase";
import { GetMonthlyTransactionAggregationUsecase } from "@/server/usecases/get-monthly-transaction-aggregation-usecase";
import { GetSankeyAggregationUsecase } from "@/server/usecases/get-sankey-aggregation-usecase";
import {
  type GetTransactionsBySlugParams,
  GetTransactionsBySlugUsecase,
} from "@/server/usecases/get-transactions-by-slug-usecase";

const prisma = new PrismaClient();
const CACHE_REVALIDATE_SECONDS = 60;

export interface GetTransactionPageDataParams
  extends Omit<GetTransactionsBySlugParams, "financialYear"> {
  financialYear: number; // 必須項目として設定
}

export const getTransactionPageDataAction = unstable_cache(
  async (params: GetTransactionPageDataParams) => {
    // モックデータを使用する場合
    if (process.env.USE_MOCK_DATA === "true") {
      const mockUsecase = new GetMockTransactionPageDataUsecase();
      return await mockUsecase.execute(params);
    }

    // 実データを取得する場合
    const transactionRepository = new PrismaTransactionRepository(prisma);
    const politicalOrganizationRepository =
      new PrismaPoliticalOrganizationRepository(prisma);

    // 4つのUsecaseを初期化
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

    const donationUsecase = new GetDailyDonationUsecase(
      transactionRepository,
      politicalOrganizationRepository,
    );

    // 4つのUsecaseを並列実行
    const [transactionData, monthlyData, sankeyData, donationData] =
      await Promise.all([
        transactionUsecase.execute(params),
        monthlyUsecase.execute({
          slug: params.slug,
          financialYear: params.financialYear,
        }),
        sankeyUsecase.execute({
          slug: params.slug,
          financialYear: params.financialYear,
        }),
        donationUsecase.execute({
          slug: params.slug,
          financialYear: params.financialYear,
          today: new Date(),
        }),
      ]);

    return {
      transactionData,
      monthlyData: monthlyData.monthlyData,
      sankeyData: sankeyData.sankeyData,
      donationSummary: donationData.donationSummary,
    };
  },
  ["transaction-page-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
