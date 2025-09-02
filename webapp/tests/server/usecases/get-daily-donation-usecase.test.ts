import { GetDailyDonationUsecase } from "@/server/usecases/get-daily-donation-usecase";
import type { IPoliticalOrganizationRepository } from "@/server/repositories/interfaces/political-organization-repository.interface";
import type { ITransactionRepository, DailyDonationData } from "@/server/repositories/interfaces/transaction-repository.interface";

describe("GetDailyDonationUsecase", () => {
  let usecase: GetDailyDonationUsecase;
  let mockTransactionRepository: jest.Mocked<ITransactionRepository>;
  let mockPoliticalOrganizationRepository: jest.Mocked<IPoliticalOrganizationRepository>;

  beforeEach(() => {
    mockTransactionRepository = {
      getDailyDonationData: jest.fn(),
    } as any;

    mockPoliticalOrganizationRepository = {
      findBySlug: jest.fn(),
    } as any;

    usecase = new GetDailyDonationUsecase(
      mockTransactionRepository,
      mockPoliticalOrganizationRepository,
    );
  });

  describe("execute", () => {
    const mockOrganization = { id: "org-1", slug: "test-org" };
    const params = {
      slug: "test-org",
      financialYear: 2025,
      today: new Date("2025-03-01"),
    };

    beforeEach(() => {
      mockPoliticalOrganizationRepository.findBySlug.mockResolvedValue(mockOrganization);
    });

    it("should throw error when political organization not found", async () => {
      mockPoliticalOrganizationRepository.findBySlug.mockResolvedValue(null);

      await expect(usecase.execute(params)).rejects.toThrow(
        'Political organization with slug "test-org" not found'
      );
    });

    it("should return donation summary with padded data for specified days", async () => {
      const mockDailyData: DailyDonationData[] = [
        { date: "2024-12-31", dailyAmount: 1000, cumulativeAmount: 1000 },
        { date: "2025-01-01", dailyAmount: 2000, cumulativeAmount: 3000 },
        { date: "2025-01-03", dailyAmount: 1500, cumulativeAmount: 4500 },
      ];

      mockTransactionRepository.getDailyDonationData.mockResolvedValue(mockDailyData);

      const result = await usecase.execute(params);

      expect(result.donationSummary.dailyDonationData).toHaveLength(90);
      expect(mockTransactionRepository.getDailyDonationData).toHaveBeenCalledWith(
        "org-1",
        2025,
        new Date("2024-12-02") // 90日前の日付（2025/3/1 - 89日）
      );
    });

    it("should use custom days range when provided", async () => {
      const mockDailyData: DailyDonationData[] = [];
      mockTransactionRepository.getDailyDonationData.mockResolvedValue(mockDailyData);

      const result = await usecase.execute({
        ...params,
        daysRange: 30,
      });

      expect(result.donationSummary.dailyDonationData).toHaveLength(30);
      expect(mockTransactionRepository.getDailyDonationData).toHaveBeenCalledWith(
        "org-1",
        2025,
        new Date("2025-01-31") // 30日前の日付（2025/3/1 - 29日）
      );
    });

    it("should pad missing days with zero donations", async () => {
      const mockDailyData: DailyDonationData[] = [
        { date: "2025-02-28", dailyAmount: 1000, cumulativeAmount: 1000 },
        { date: "2025-03-01", dailyAmount: 500, cumulativeAmount: 1500 },
      ];

      mockTransactionRepository.getDailyDonationData.mockResolvedValue(mockDailyData);

      const result = await usecase.execute({
        ...params,
        today: new Date("2025-03-01"),
      });

      const donationData = result.donationSummary.dailyDonationData;
      
      // 2月28日はデータがある
      expect(donationData.find(d => d.date === "2025-02-28")).toEqual({
        date: "2025-02-28",
        dailyAmount: 1000,
        cumulativeAmount: 1000,
      });

      // 3月1日はデータがある
      expect(donationData.find(d => d.date === "2025-03-01")).toEqual({
        date: "2025-03-01",
        dailyAmount: 500,
        cumulativeAmount: 1500,
      });

      // 2月27日はデータがないので0で埋められる（累積は前の値を維持）
      const feb27Data = donationData.find(d => d.date === "2025-02-27");
      expect(feb27Data?.dailyAmount).toBe(0);
      expect(feb27Data?.cumulativeAmount).toBe(0); // まだ寄付がない時期なので0
    });

    it("should calculate day over day correctly", async () => {
      const mockDailyData: DailyDonationData[] = [
        { date: "2025-02-28", dailyAmount: 1000, cumulativeAmount: 1000 },
        { date: "2025-03-01", dailyAmount: 1500, cumulativeAmount: 2500 },
      ];

      mockTransactionRepository.getDailyDonationData.mockResolvedValue(mockDailyData);

      const result = await usecase.execute({
        ...params,
        today: new Date("2025-03-01"),
      });

      const summary = result.donationSummary;
      expect(summary.amountDayOverDay).toBe(500); // 1500 - 1000
      expect(summary.countDayOverDay).toBe(0); // 両日とも寄付があるので差は0
    });

    it("should handle empty donation data", async () => {
      mockTransactionRepository.getDailyDonationData.mockResolvedValue([]);

      const result = await usecase.execute(params);

      expect(result.donationSummary.dailyDonationData).toHaveLength(90);
      expect(result.donationSummary.totalAmount).toBe(0);
      expect(result.donationSummary.totalDays).toBe(90);
      expect(result.donationSummary.amountDayOverDay).toBe(0);
      expect(result.donationSummary.countDayOverDay).toBe(0);
    });

    it("should return exactly 3 records for 8/1 to 8/3 with gap filling", async () => {
      const mockDailyData: DailyDonationData[] = [
        { date: "2025-08-01", dailyAmount: 1000, cumulativeAmount: 1000 },
        { date: "2025-08-03", dailyAmount: 2000, cumulativeAmount: 3000 },
      ];

      mockTransactionRepository.getDailyDonationData.mockResolvedValue(mockDailyData);

      const result = await usecase.execute({
        ...params,
        today: new Date("2025-08-03"),
        daysRange: 3,
      });

      const donationData = result.donationSummary.dailyDonationData;
      
      // 3レコード返ることを確認
      expect(donationData).toHaveLength(3);
      
      // 8/1のデータ確認
      expect(donationData[0]).toEqual({
        date: "2025-08-01",
        dailyAmount: 1000,
        cumulativeAmount: 1000,
      });
      
      // 8/2のデータ確認（寄付なしなので0で埋められる）
      expect(donationData[1]).toEqual({
        date: "2025-08-02", 
        dailyAmount: 0,
        cumulativeAmount: 1000, // 前日の累積を維持
      });
      
      // 8/3のデータ確認
      expect(donationData[2]).toEqual({
        date: "2025-08-03",
        dailyAmount: 2000, 
        cumulativeAmount: 3000,
      });

      // repositoryが正しい日付範囲で呼ばれることを確認
      expect(mockTransactionRepository.getDailyDonationData).toHaveBeenCalledWith(
        "org-1",
        2025,
        new Date("2025-08-01") // 3日前の日付（2025/8/3 - 2日）
      );
    });
  });

  describe("calculateDaysAgo", () => {
    it("should calculate 90 days ago correctly", () => {
      const today = new Date("2025-03-01");
      const result = (usecase as any).calculateDaysAgo(today, 90);
      
      // 2025/3/1から89日前は2024/12/2
      expect(result.toISOString().split("T")[0]).toBe("2024-12-02");
    });

    it("should handle leap year correctly", () => {
      const today = new Date("2024-03-01"); // 2024年はうるう年
      const result = (usecase as any).calculateDaysAgo(today, 90);
      
      // 2024/3/1から89日前は2023/12/3  
      expect(result.toISOString().split("T")[0]).toBe("2023-12-03");
    });

    it("should calculate custom days range", () => {
      const today = new Date("2025-01-10");
      const result = (usecase as any).calculateDaysAgo(today, 30);
      
      // 2025/1/10から29日前は2024/12/12
      expect(result.toISOString().split("T")[0]).toBe("2024-12-12");
    });
  });

  describe("padMissingDays", () => {
    it("should pad missing days correctly", () => {
      const mockData: DailyDonationData[] = [
        { date: "2025-01-01", dailyAmount: 1000, cumulativeAmount: 1000 },
        { date: "2025-01-03", dailyAmount: 500, cumulativeAmount: 1500 },
      ];

      const fromDate = new Date("2025-01-01");
      const toDate = new Date("2025-01-03");

      const result = (usecase as any).padMissingDays(mockData, fromDate, toDate);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ date: "2025-01-01", dailyAmount: 1000, cumulativeAmount: 1000 });
      expect(result[1]).toEqual({ date: "2025-01-02", dailyAmount: 0, cumulativeAmount: 1000 });
      expect(result[2]).toEqual({ date: "2025-01-03", dailyAmount: 500, cumulativeAmount: 1500 });
    });

    it("should handle all missing days", () => {
      const mockData: DailyDonationData[] = [];
      const fromDate = new Date("2025-01-01");
      const toDate = new Date("2025-01-02");

      const result = (usecase as any).padMissingDays(mockData, fromDate, toDate);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ date: "2025-01-01", dailyAmount: 0, cumulativeAmount: 0 });
      expect(result[1]).toEqual({ date: "2025-01-02", dailyAmount: 0, cumulativeAmount: 0 });
    });
  });
});