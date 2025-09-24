import { GetSankeyAggregationUsecase } from "../../../src/server/usecases/get-sankey-aggregation-usecase";
import type { ITransactionRepository } from "../../../src/server/repositories/interfaces/transaction-repository.interface";
import type { IPoliticalOrganizationRepository } from "../../../src/server/repositories/interfaces/political-organization-repository.interface";
import type { IBalanceSnapshotRepository } from "../../../src/server/repositories/interfaces/balance-snapshot-repository.interface";
import type { PoliticalOrganization } from "@/shared/models/political-organization";

const mockTransactionRepository: jest.Mocked<ITransactionRepository> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findWithPagination: jest.fn(),
  getCategoryAggregationForSankey: jest.fn(),
  getMonthlyAggregation: jest.fn(),
  getDailyDonationData: jest.fn(),
  getBorrowingIncomeTotal: jest.fn(),
  getBorrowingExpenseTotal: jest.fn(),
  getLastUpdatedAt: jest.fn(),
};

const mockPoliticalOrganizationRepository: jest.Mocked<IPoliticalOrganizationRepository> = {
  findBySlug: jest.fn(),
  findBySlugs: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

const mockBalanceSnapshotRepository: jest.Mocked<IBalanceSnapshotRepository> = {
  getTotalLatestBalanceByOrgIds: jest.fn(),
  getTotalLatestBalancesByYear: jest.fn(),
};

describe("GetSankeyAggregationUsecase", () => {
  let usecase: GetSankeyAggregationUsecase;

  beforeEach(() => {
    usecase = new GetSankeyAggregationUsecase(
      mockTransactionRepository,
      mockPoliticalOrganizationRepository,
      mockBalanceSnapshotRepository,
    );

    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should successfully aggregate data with unrealized expenses", async () => {
      const mockOrganizations: PoliticalOrganization[] = [
        { 
          id: "org1", 
          displayName: "Test Org 1",
          orgName: "Test Org 1",
          slug: "test-org-1",
          description: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: "org2", 
          displayName: "Test Org 2",
          orgName: "Test Org 2", 
          slug: "test-org-2",
          description: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];

      const mockAggregation = {
        income: [
          { category: "寄附", totalAmount: 2000000 },
        ],
        expense: [
          { category: "政治活動費", totalAmount: 1000000 },
        ],
      };

      const mockBalances = {
        currentYear: 300000,
        previousYear: 150000,
      };

      const mockUnrealizedTransactions = [
        {
          id: "tx1",
          political_organization_id: "org1",
          transaction_no: "001",
          transaction_date: new Date("2025-09-30"),
          financial_year: 2025,
          transaction_type: "expense" as const,
          debit_account: "未払費用",
          debit_amount: 500000,
          credit_account: "普通預金",
          credit_amount: 500000,
          description: "9月分の人件費未払費用",
          friendly_category: "人件費",
          memo: "",
          category_key: "accrued-expenses",
          label: "",
          hash: "test-hash",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockPoliticalOrganizationRepository.findBySlugs.mockResolvedValue(mockOrganizations);
      mockTransactionRepository.getCategoryAggregationForSankey.mockResolvedValue(mockAggregation);
      mockBalanceSnapshotRepository.getTotalLatestBalancesByYear.mockResolvedValue(mockBalances);
      mockTransactionRepository.findAll.mockResolvedValue(mockUnrealizedTransactions);

      const result = await usecase.execute({
        slugs: ["test-org-1", "test-org-2"],
        financialYear: 2025,
        categoryType: "political-category",
      });

      expect(mockPoliticalOrganizationRepository.findBySlugs).toHaveBeenCalledWith(["test-org-1", "test-org-2"]);
      expect(mockTransactionRepository.getCategoryAggregationForSankey).toHaveBeenCalledWith(
        ["org1", "org2"],
        2025,
        "political-category",
      );
      expect(mockBalanceSnapshotRepository.getTotalLatestBalancesByYear).toHaveBeenCalledWith(
        ["org1", "org2"],
        2025,
      );
      expect(mockTransactionRepository.findAll).toHaveBeenCalledWith({
        political_organization_ids: ["org1", "org2"],
        financial_year: 2025,
        debit_account: "未払費用",
      });

      expect(result.sankeyData).toBeDefined();
      expect(result.sankeyData.nodes).toBeDefined();
      expect(result.sankeyData.links).toBeDefined();
    });

    it("should handle organizations not found", async () => {
      mockPoliticalOrganizationRepository.findBySlugs.mockResolvedValue([]);

      await expect(
        usecase.execute({
          slugs: ["non-existent"],
          financialYear: 2025,
        }),
      ).rejects.toThrow('Political organizations with slugs "non-existent" not found');
    });

    it("should handle unrealized expenses aggregation errors gracefully", async () => {
      const mockOrganizations: PoliticalOrganization[] = [{ 
        id: "org1", 
        displayName: "Test Org",
        orgName: "Test Org",
        slug: "test-org",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      const mockAggregation = {
        income: [{ category: "寄附", totalAmount: 1000000 }],
        expense: [{ category: "政治活動費", totalAmount: 800000 }],
      };
      const mockBalances = { currentYear: 0, previousYear: 0 };

      mockPoliticalOrganizationRepository.findBySlugs.mockResolvedValue(mockOrganizations);
      mockTransactionRepository.getCategoryAggregationForSankey.mockResolvedValue(mockAggregation);
      mockBalanceSnapshotRepository.getTotalLatestBalancesByYear.mockResolvedValue(mockBalances);
      mockTransactionRepository.findAll.mockRejectedValue(new Error("Database error"));

      const result = await usecase.execute({
        slugs: ["test-org"],
        financialYear: 2025,
      });

      expect(result.sankeyData).toBeDefined();
    });
  });

  describe("getUnrealizedExpensesAggregation", () => {
    it("should aggregate unrealized expenses correctly", async () => {
      const mockOrganizations: PoliticalOrganization[] = [{ 
        id: "org1", 
        displayName: "Test Org",
        orgName: "Test Org",
        slug: "test-org",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      const mockTransactions = [
        {
          id: "tx1",
          political_organization_id: "org1",
          transaction_no: "001",
          transaction_date: new Date("2025-09-30"),
          financial_year: 2025,
          transaction_type: "expense" as const,
          debit_account: "未払費用",
          debit_amount: 300000,
          credit_account: "普通預金",
          credit_amount: 300000,
          description: "未払費用1",
          friendly_category: "人件費",
          memo: "",
          category_key: "accrued-expenses",
          label: "",
          hash: "hash1",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "tx2",
          political_organization_id: "org1",
          transaction_no: "002",
          transaction_date: new Date("2025-09-30"),
          financial_year: 2025,
          transaction_type: "expense" as const,
          debit_account: "未払費用",
          debit_amount: 700000,
          credit_account: "普通預金",
          credit_amount: 700000,
          description: "未払費用2",
          friendly_category: "人件費",
          memo: "",
          category_key: "accrued-expenses",
          label: "",
          hash: "hash2",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockPoliticalOrganizationRepository.findBySlugs.mockResolvedValue(mockOrganizations);
      mockTransactionRepository.findAll.mockResolvedValue(mockTransactions);

      const result = await (usecase as any).getUnrealizedExpensesAggregation({
        slugs: ["test-org"],
        financialYear: 2025,
      });

      expect(result).toEqual([
        {
          category: "未払費用",
          subcategory: "未払費用",
          totalAmount: 1000000, // 300000 + 700000
        },
      ]);
    });

    it("should return empty array when no organizations found", async () => {
      mockPoliticalOrganizationRepository.findBySlugs.mockResolvedValue([]);

      const result = await (usecase as any).getUnrealizedExpensesAggregation({
        slugs: ["non-existent"],
        financialYear: 2025,
      });

      expect(result).toEqual([]);
    });

    it("should handle database errors gracefully", async () => {
      const mockOrganizations: PoliticalOrganization[] = [{ 
        id: "org1", 
        displayName: "Test Org",
        orgName: "Test Org",
        slug: "test-org",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      mockPoliticalOrganizationRepository.findBySlugs.mockResolvedValue(mockOrganizations);
      mockTransactionRepository.findAll.mockRejectedValue(new Error("Database connection failed"));

      const result = await (usecase as any).getUnrealizedExpensesAggregation({
        slugs: ["test-org"],
        financialYear: 2025,
      });

      expect(result).toEqual([]);
    });
  });
});
