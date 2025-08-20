import type {
  Transaction,
  TransactionFilters,
} from "@/shared/models/transaction";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PaginationOptions {
  page: number;
  perPage: number;
}

// Sankey集計データの型定義
export interface TransactionCategoryAggregation {
  category: string;
  subcategory?: string;
  totalAmount: number;
}

export interface SankeyCategoryAggregationResult {
  income: TransactionCategoryAggregation[];
  expense: TransactionCategoryAggregation[];
}

// 月次集計データの型定義
export interface MonthlyAggregation {
  yearMonth: string; // "YYYY-MM" 形式
  income: number;
  expense: number;
}

// 日次寄付データの型定義
export interface DailyDonationData {
  date: string; // "YYYY-MM-DD" 形式
  dailyAmount: number; // その日の寄付額
  cumulativeAmount: number; // 累積寄付額
}

// 寄付サマリーデータの型定義
export interface DonationSummaryData {
  dailyDonationData: DailyDonationData[];
  totalAmount: number; // 累計寄付金額
  totalDays: number; // 寄付日数
  amountDayOverDay: number; // 寄付金額の前日比
  countDayOverDay: number; // 寄付件数の前日比
}

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  findWithPagination(
    filters?: TransactionFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Transaction>>;
  getCategoryAggregationForSankey(
    politicalOrganizationId: string,
    financialYear: number,
  ): Promise<SankeyCategoryAggregationResult>;
  getMonthlyAggregation(
    politicalOrganizationId: string,
    financialYear: number,
  ): Promise<MonthlyAggregation[]>;
  getDailyDonationData(
    politicalOrganizationId: string,
    financialYear: number,
  ): Promise<DailyDonationData[]>;
}
