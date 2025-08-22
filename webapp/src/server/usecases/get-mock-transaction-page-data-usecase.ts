import "server-only";

import type { GetTransactionPageDataParams } from "@/server/actions/get-transaction-page-data";
import type { MonthlyAggregation } from "@/server/repositories/interfaces/transaction-repository.interface";
import type { DonationSummaryData } from "@/server/usecases/get-daily-donation-usecase";
import type { SankeyData } from "@/types/sankey";

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

const MOCK_TRANSACTION_DATA = {
  transactions: [],
  total: 0,
  page: 1,
  perPage: 20,
  totalPages: 0,
  politicalOrganization: {
    id: "mock-org-id",
    name: "モック政治団体",
    slug: "mock-slug",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  summary: {
    totalIncome: 3180,
    totalExpense: 2530,
    netAmount: 650,
    transactionCount: 0,
  },
};

export class GetMockTransactionPageDataUsecase {
  async execute(params: GetTransactionPageDataParams) {
    console.log("🔧 Using mock data for development");

    return {
      transactionData: {
        ...MOCK_TRANSACTION_DATA,
        politicalOrganization: {
          ...MOCK_TRANSACTION_DATA.politicalOrganization,
          slug: params.slug,
        },
      },
      monthlyData: MOCK_MONTHLY_DATA,
      sankeyData: MOCK_SANKEY_DATA,
      donationSummary: MOCK_DONATION_SUMMARY,
    };
  }
}
