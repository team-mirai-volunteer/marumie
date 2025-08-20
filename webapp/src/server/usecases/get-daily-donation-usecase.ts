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

      // 日次寄付データを取得
      const dailyDonationData =
        await this.transactionRepository.getDailyDonationData(
          politicalOrganization.id,
          params.financialYear,
        );

      // Usecaseでサマリー計算を実行
      const donationSummary = this.calculateDonationSummary(
        dailyDonationData,
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
}
