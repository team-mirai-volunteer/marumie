import "server-only";

import type { TopPageDataParams } from "@/server/loaders/load-top-page-data";
import type { MonthlyAggregation } from "@/server/repositories/interfaces/transaction-repository.interface";
import type { DonationSummaryData } from "@/server/usecases/get-daily-donation-usecase";
import type { SankeyData } from "@/types/sankey";

// モックデータ定義
const MOCK_MONTHLY_DATA: MonthlyAggregation[] = [
  { yearMonth: "2025-01", income: 2000000, expense: 1500000 },
  { yearMonth: "2025-02", income: 1800000, expense: 2200000 },
  { yearMonth: "2025-03", income: 2500000, expense: 1900000 },
  { yearMonth: "2025-04", income: 3000000, expense: 2800000 },
  { yearMonth: "2025-05", income: 2200000, expense: 1600000 },
  { yearMonth: "2025-06", income: 2800000, expense: 2000000 },
  { yearMonth: "2025-07", income: 3200000, expense: 2400000 },
  { yearMonth: "2025-08", income: 2900000, expense: 2100000 },
  { yearMonth: "2025-09", income: 2600000, expense: 2300000 },
  { yearMonth: "2025-10", income: 3100000, expense: 1900000 },
  { yearMonth: "2025-11", income: 2700000, expense: 2500000 },
  { yearMonth: "2025-12", income: 3400000, expense: 2000000 },
];

const MOCK_SANKEY_DATA: SankeyData = {
  nodes: [
    { id: "個人からの寄付" },
    { id: "法人その他の団体からの寄附" },
    { id: "合計" },
    { id: "人件費" },
    { id: "事務所費" },
    { id: "その他経費" },
  ],
  links: [
    { source: "個人からの寄付", target: "合計", value: 18000000 },
    { source: "法人その他の団体からの寄附", target: "合計", value: 5000000 },
    { source: "合計", target: "人件費", value: 12000000 },
    { source: "合計", target: "事務所費", value: 6000000 },
    { source: "合計", target: "その他経費", value: 5000000 },
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
  lastNonZeroDonationDate: new Date().toISOString().split("T")[0], // 今日をモックデータとして設定
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
    totalIncome: 31800000,
    totalExpense: 25300000,
    netAmount: 6500000,
    transactionCount: 0,
  },
  lastUpdatedAt: "2025-08-27T00:00:00.000Z",
};

export class GetMockTransactionPageDataUsecase {
  async execute(params: TopPageDataParams) {
    console.log("🔧 Using mock data for development");

    return {
      transactionData: {
        ...MOCK_TRANSACTION_DATA,
        politicalOrganizations: [
          {
            ...MOCK_TRANSACTION_DATA.politicalOrganization,
            slug: params.slugs[0] || "mock-slug",
          },
        ],
      },
      monthlyData: MOCK_MONTHLY_DATA,
      political: MOCK_SANKEY_DATA,
      friendly: MOCK_SANKEY_DATA,
      donationSummary: MOCK_DONATION_SUMMARY,
    };
  }
}
