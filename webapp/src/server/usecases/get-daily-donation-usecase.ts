import type { IPoliticalOrganizationRepository } from "../repositories/interfaces/political-organization-repository.interface";
import type {
  DailyDonationData,
  ITransactionRepository,
} from "../repositories/interfaces/transaction-repository.interface";

export interface DonationSummaryData {
  dailyDonationData: DailyDonationData[];
  totalAmount: number; // 累計寄付金額
  totalDays: number; // 寄付日数
  amountDayOverDay: number; // 寄付金額の前日比
  countDayOverDay: number; // 寄付件数の前日比
}

export interface GetDailyDonationParams {
  slug: string;
  financialYear: number;
  today: Date;
  daysRange?: number;
}

export interface GetDailyDonationResult {
  donationSummary: DonationSummaryData;
}

export class GetDailyDonationUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private politicalOrganizationRepository: IPoliticalOrganizationRepository,
  ) {}

  async execute(
    params: GetDailyDonationParams,
  ): Promise<GetDailyDonationResult> {
    try {
      const politicalOrganization =
        await this.politicalOrganizationRepository.findBySlug(params.slug);

      if (!politicalOrganization) {
        throw new Error(
          `Political organization with slug "${params.slug}" not found`,
        );
      }

      // 指定日数前の日付を計算
      const daysRange = params.daysRange ?? 90;
      const fromDaysAgo = this.calculateDaysAgo(params.today, daysRange);

      // 日次寄付データを取得（指定日数分）
      const dailyDonationData =
        await this.transactionRepository.getDailyDonationData(
          politicalOrganization.id,
          params.financialYear,
          fromDaysAgo,
        );

      // 寄付がない日を埋めて指定日数分のレコード作成
      const paddedDailyData = this.padMissingDays(
        dailyDonationData,
        fromDaysAgo,
        params.today,
      );

      // Usecaseでサマリー計算を実行
      const donationSummary = this.calculateDonationSummary(
        paddedDailyData,
        params.today,
      );

      return { donationSummary };
    } catch (error) {
      throw new Error(
        `Failed to get daily donation data: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private calculateDonationSummary(
    dailyDonationData: DailyDonationData[],
    today: Date,
  ): DonationSummaryData {
    // 統計情報を計算
    const totalAmount =
      dailyDonationData[dailyDonationData.length - 1]?.cumulativeAmount || 0;
    const totalDays = dailyDonationData.length;

    // 今日と昨日の日付を文字列で準備
    const todayStr = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // 今日と昨日の寄付データを検索
    const todayData = dailyDonationData.find((item) => item.date === todayStr);
    const yesterdayData = dailyDonationData.find(
      (item) => item.date === yesterdayStr,
    );

    // 前日比の計算（常に差分を計算）
    const todayDonation = todayData?.dailyAmount || 0;
    const yesterdayDonation = yesterdayData?.dailyAmount || 0;
    const amountDayOverDay = todayDonation - yesterdayDonation;

    // 寄付件数の前日比（寄付があった日をカウント）
    const todayHasDonation = todayDonation > 0 ? 1 : 0;
    const yesterdayHasDonation = yesterdayDonation > 0 ? 1 : 0;
    const countDayOverDay = todayHasDonation - yesterdayHasDonation;

    return {
      dailyDonationData,
      totalAmount,
      totalDays,
      amountDayOverDay,
      countDayOverDay,
    };
  }

  private calculateDaysAgo(today: Date, daysRange: number): Date {
    const fromDaysAgo = new Date(today);
    fromDaysAgo.setDate(fromDaysAgo.getDate() - (daysRange - 1)); // 今日を含めて指定日数
    return fromDaysAgo;
  }

  private padMissingDays(
    dailyDonationData: DailyDonationData[],
    fromDate: Date,
    toDate: Date,
  ): DailyDonationData[] {
    const result: DailyDonationData[] = [];
    const currentDate = new Date(fromDate);
    let cumulativeAmount = 0;

    // データをMapに変換して高速検索
    const dataMap = new Map<string, DailyDonationData>();
    for (const data of dailyDonationData) {
      dataMap.set(data.date, data);
    }

    while (currentDate <= toDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const existingData = dataMap.get(dateStr);

      if (existingData) {
        // 既存データがある場合
        result.push(existingData);
        cumulativeAmount = existingData.cumulativeAmount;
      } else {
        // 寄付がない日の場合、0で埋める
        result.push({
          date: dateStr,
          dailyAmount: 0,
          cumulativeAmount,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }
}
