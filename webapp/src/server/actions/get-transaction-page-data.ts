"use server";

import { PrismaClient } from "@prisma/client";
import type {
  DailyDonationData,
  MonthlyAggregation,
  TransactionCategoryAggregation,
} from "@/server/repositories/interfaces/transaction-repository.interface";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import type { DonationSummaryData } from "@/server/usecases/get-daily-donation-usecase";
import { GetDailyDonationUsecase } from "@/server/usecases/get-daily-donation-usecase";
import { GetMonthlyTransactionAggregationUsecase } from "@/server/usecases/get-monthly-transaction-aggregation-usecase";
import { GetSankeyAggregationUsecase } from "@/server/usecases/get-sankey-aggregation-usecase";
import {
  type GetTransactionsBySlugParams,
  GetTransactionsBySlugUsecase,
} from "@/server/usecases/get-transactions-by-slug-usecase";
import type { SankeyData } from "@/types/sankey";

const prisma = new PrismaClient();

// モックデータフラグ（開発環境でのみ有効）
const USE_MOCK_DATA =
  process.env.NODE_ENV === "development" &&
  process.env.USE_MOCK_DATA === "true";

// モックデータ定義
const MOCK_MONTHLY_DATA: MonthlyAggregation[] = [
  { yearMonth: "2025-01", income: 200, expense: 150 },
  { yearMonth: "2025-02", income: 180, expense: 220 },
  { yearMonth: "2025-03", income: 250, expense: 190 },
  { yearMonth: "2025-04", income: 300, expense: 280 },
  { yearMonth: "2025-05", income: 220, expense: 160 },
  { yearMonth: "2025-06", income: 280, expense: 200 },
  { yearMonth: "2025-07", income: 320, expense: 240 },
  { yearMonth: "2025-08", income: 290, expense: 210 },
  { yearMonth: "2025-09", income: 260, expense: 230 },
  { yearMonth: "2025-10", income: 310, expense: 190 },
  { yearMonth: "2025-11", income: 270, expense: 250 },
  { yearMonth: "2025-12", income: 340, expense: 200 },
];

const MOCK_SANKEY_DATA: SankeyData = {
  nodes: [
    { id: "寄付" },
    { id: "個人からの寄付" },
    { id: "法人その他の団体からの寄附" },
    { id: "合計" },
    { id: "人件費" },
    { id: "事務所費" },
    { id: "その他経費" },
  ],
  links: [
    { source: "個人からの寄付", target: "合計", value: 1800 },
    { source: "法人その他の団体からの寄附", target: "合計", value: 500 },
    { source: "合計", target: "人件費", value: 1200 },
    { source: "合計", target: "事務所費", value: 600 },
    { source: "合計", target: "その他経費", value: 500 },
  ],
};

const MOCK_DONATION_SUMMARY: DonationSummaryData = {
  dailyDonationData: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const baseAmount = 50000 + Math.random() * 200000;
    const cumulativeAmount = 1000000 + (i + 1) * baseAmount;

    return {
      date: date.toISOString().split("T")[0],
      dailyAmount: Math.floor(baseAmount),
      cumulativeAmount: Math.floor(cumulativeAmount),
    };
  }),
  totalAmount: 8500000,
  totalDays: 30,
  amountDayOverDay: 125000,
  countDayOverDay: 1,
};

export interface GetTransactionPageDataParams
  extends Omit<GetTransactionsBySlugParams, "financialYear"> {
  financialYear: number; // 必須項目として設定
}

export async function getTransactionPageDataAction(
  params: GetTransactionPageDataParams,
) {
  // モックデータを使用する場合
  if (USE_MOCK_DATA) {
    console.log("🔧 Using mock data for development");

    return {
      transactionData: {
        transactions: [],
        total: 0,
        page: 1,
        perPage: 20,
        totalPages: 0,
        politicalOrganization: {
          id: "mock-org-id",
          name: "モック政治団体",
          slug: params.slug,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        summary: {
          totalIncome: 3180,
          totalExpense: 2530,
          netAmount: 650,
          transactionCount: 0,
        },
      },
      monthlyData: MOCK_MONTHLY_DATA,
      sankeyData: MOCK_SANKEY_DATA,
      donationSummary: MOCK_DONATION_SUMMARY,
    };
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
}
