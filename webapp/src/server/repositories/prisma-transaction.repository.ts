import {
  Prisma,
  type PrismaClient,
  type Transaction as PrismaTransaction,
} from "@prisma/client";
import type {
  Transaction,
  TransactionFilters,
  TransactionType,
  TransactionWithOrganization,
} from "@/shared/models/transaction";
import type { DisplayTransactionType } from "@/types/display-transaction";
import { ACCOUNT_CATEGORY_MAPPING } from "@/shared/utils/category-mapping";
import type {
  DailyDonationData,
  ITransactionRepository,
  MonthlyAggregation,
  PaginatedResult,
  PaginationOptions,
  SankeyCategoryAggregationResult,
  SortOptions,
  TransactionCategoryAggregation,
} from "./interfaces/transaction-repository.interface";

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: BigInt(id) },
    });

    return transaction ? this.mapToTransaction(transaction) : null;
  }

  async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const where = this.buildWhereClause(filters);

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { transactionDate: "desc" },
    });

    return transactions.map(this.mapToTransaction);
  }

  async findAllIncludeOrganization(
    filters?: TransactionFilters,
    sortOptions?: SortOptions,
  ): Promise<TransactionWithOrganization[]> {
    const where = this.buildWhereClause(filters);

    // Build orderBy based on sortBy and order parameters
    const orderBy = this.buildOrderByClause(
      sortOptions?.sortBy,
      sortOptions?.order,
    );

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        politicalOrganization: true,
      },
      orderBy,
    });

    return transactions.map((t) => this.mapToTransactionWithOrganization(t));
  }

  async findWithPagination(
    filters?: TransactionFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Transaction>> {
    const where = this.buildWhereClause(filters);

    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 50;
    const skip = (page - 1) * perPage;

    // Build orderBy based on sortBy and order parameters
    const orderBy = this.buildOrderByClause(
      pagination?.sortBy,
      pagination?.order,
    );

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return {
      items: transactions.map(this.mapToTransaction),
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async findWithPaginationIncludeOrganization(
    filters?: TransactionFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<TransactionWithOrganization>> {
    const where = this.buildWhereClause(filters);

    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 50;
    const skip = (page - 1) * perPage;

    // Build orderBy based on sortBy and order parameters
    const orderBy = this.buildOrderByClause(
      pagination?.sortBy,
      pagination?.order,
    );

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          politicalOrganization: true,
        },
        orderBy,
        skip,
        take: perPage,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return {
      items: transactions.map((t) => this.mapToTransactionWithOrganization(t)),
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async getCategoryAggregationForSankey(
    politicalOrganizationIds: string[],
    financialYear: number,
    categoryType?: "political-category" | "friendly-category",
  ): Promise<SankeyCategoryAggregationResult> {
    if (categoryType === "friendly-category") {
      return this.getCategoryAggregationWithTag(
        politicalOrganizationIds,
        financialYear,
      );
    }

    // デフォルト: politicalカテゴリーの場合は、従来通りmainCategory + subCategoryでグループ化
    const baseWhere = {
      politicalOrganizationId: {
        in: politicalOrganizationIds.map((id) => BigInt(id)),
      },
      financialYear,
    };

    const incomeAggregation = await this.prisma.transaction.groupBy({
      by: ["creditAccount"],
      where: {
        ...baseWhere,
        transactionType: "income",
      },
      _sum: {
        creditAmount: true,
      },
    });

    const expenseAggregation = await this.prisma.transaction.groupBy({
      by: ["debitAccount"],
      where: {
        ...baseWhere,
        transactionType: "expense",
      },
      _sum: {
        debitAmount: true,
      },
    });

    // accountからcategory/subcategoryにマッピングして集計
    const income = this.aggregateByCategory(
      incomeAggregation.map((item) => ({
        account: item.creditAccount || "",
        amount: Number(item._sum.creditAmount || 0),
      })),
    );

    const expense = this.aggregateByCategory(
      expenseAggregation.map((item) => ({
        account: item.debitAccount || "",
        amount: Number(item._sum.debitAmount || 0),
      })),
    );

    return { income, expense };
  }

  async getCategoryAggregationWithTag(
    politicalOrganizationIds: string[],
    financialYear: number,
  ): Promise<SankeyCategoryAggregationResult> {
    const baseWhere = {
      politicalOrganizationId: {
        in: politicalOrganizationIds.map((id) => BigInt(id)),
      },
      financialYear,
    };

    // friendlyカテゴリーの場合は、mainCategory + tagでグループ化
    const incomeAggregation = await this.prisma.transaction.groupBy({
      by: ["creditAccount", "friendlyCategory"],
      where: {
        ...baseWhere,
        transactionType: "income",
      },
      _sum: {
        creditAmount: true,
      },
    });

    const expenseAggregation = await this.prisma.transaction.groupBy({
      by: ["debitAccount", "friendlyCategory"],
      where: {
        ...baseWhere,
        transactionType: "expense",
      },
      _sum: {
        debitAmount: true,
      },
    });

    // accountとtagでグループ化
    const income = this.aggregateByCategoryWithTag(
      incomeAggregation.map((item) => ({
        account: item.creditAccount || "",
        tag: item.friendlyCategory || "",
        amount: Number(item._sum.creditAmount || 0),
      })),
    );

    const expense = this.aggregateByCategoryWithTag(
      expenseAggregation.map((item) => ({
        account: item.debitAccount || "",
        tag: item.friendlyCategory || "",
        amount: Number(item._sum.debitAmount || 0),
      })),
    );

    return { income, expense };
  }

  async getMonthlyAggregation(
    politicalOrganizationIds: string[],
    financialYear: number,
  ): Promise<MonthlyAggregation[]> {
    const organizationIdsBigInt = politicalOrganizationIds.map((id) =>
      BigInt(id),
    );

    const [incomeResults, expenseResults] = await Promise.all([
      this.prisma.$queryRaw<
        Array<{ year: bigint; month: bigint; total_amount: number }>
      >`
        SELECT
          EXTRACT(YEAR FROM transaction_date) as year,
          EXTRACT(MONTH FROM transaction_date) as month,
          SUM(credit_amount) as total_amount
        FROM transactions
        WHERE political_organization_id IN (${Prisma.join(organizationIdsBigInt)})
          AND financial_year = ${financialYear}
          AND transaction_type = 'income'
        GROUP BY EXTRACT(YEAR FROM transaction_date), EXTRACT(MONTH FROM transaction_date)
        ORDER BY year, month
      `,
      this.prisma.$queryRaw<
        Array<{ year: bigint; month: bigint; total_amount: number }>
      >`
        SELECT
          EXTRACT(YEAR FROM transaction_date) as year,
          EXTRACT(MONTH FROM transaction_date) as month,
          SUM(debit_amount) as total_amount
        FROM transactions
        WHERE political_organization_id IN (${Prisma.join(organizationIdsBigInt)})
          AND financial_year = ${financialYear}
          AND transaction_type = 'expense'
        GROUP BY EXTRACT(YEAR FROM transaction_date), EXTRACT(MONTH FROM transaction_date)
        ORDER BY year, month
      `,
    ]);

    // 年月別のマップを作成
    const monthlyMap = new Map<
      string,
      { yearMonth: string; income: number; expense: number }
    >();

    // 収入データを追加
    for (const item of incomeResults) {
      const year = Number(item.year);
      const month = Number(item.month);
      const yearMonth = `${year}-${month.toString().padStart(2, "0")}`;
      if (!monthlyMap.has(yearMonth)) {
        monthlyMap.set(yearMonth, { yearMonth, income: 0, expense: 0 });
      }
      const existing = monthlyMap.get(yearMonth);
      if (existing) {
        existing.income = Number(item.total_amount);
      }
    }

    // 支出データを追加
    for (const item of expenseResults) {
      const year = Number(item.year);
      const month = Number(item.month);
      const yearMonth = `${year}-${month.toString().padStart(2, "0")}`;
      if (!monthlyMap.has(yearMonth)) {
        monthlyMap.set(yearMonth, { yearMonth, income: 0, expense: 0 });
      }
      const existing = monthlyMap.get(yearMonth);
      if (existing) {
        existing.expense = Number(item.total_amount);
      }
    }

    return Array.from(monthlyMap.values()).sort((a, b) =>
      a.yearMonth.localeCompare(b.yearMonth),
    );
  }

  async getDailyDonationData(
    politicalOrganizationIds: string[],
    financialYear: number,
  ): Promise<DailyDonationData[]> {
    // 寄附カテゴリに該当するアカウントキーを抽出
    const donationAccountKeys = Object.keys(ACCOUNT_CATEGORY_MAPPING).filter(
      (key) => ACCOUNT_CATEGORY_MAPPING[key].category === "寄附",
    );
    const organizationIdsBigInt = politicalOrganizationIds.map((id) =>
      BigInt(id),
    );

    // 寄附に該当するアカウントからの収入データを日別に集計
    const dailyDonationResults = await this.prisma.$queryRaw<
      Array<{ transaction_date: Date; total_amount: number }>
    >`
      SELECT
        transaction_date,
        SUM(credit_amount) as total_amount
      FROM transactions
      WHERE political_organization_id IN (${Prisma.join(organizationIdsBigInt)})
        AND financial_year = ${financialYear}
        AND transaction_type = 'income'
        AND credit_account IN (${Prisma.join(donationAccountKeys)})
      GROUP BY transaction_date
      ORDER BY transaction_date
    `;

    // 日付文字列にフォーマットし、累積額を計算
    let cumulativeAmount = 0;
    const dailyData: DailyDonationData[] = dailyDonationResults.map((item) => {
      const dailyAmount = Number(item.total_amount);
      cumulativeAmount += dailyAmount;

      return {
        date: item.transaction_date.toISOString().split("T")[0], // YYYY-MM-DD形式
        dailyAmount,
        cumulativeAmount,
      };
    });

    return dailyData;
  }

  async getBorrowingIncomeTotal(
    politicalOrganizationIds: string[],
    financialYear: number,
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      _sum: {
        creditAmount: true,
      },
      where: {
        politicalOrganizationId: {
          in: politicalOrganizationIds.map((id) => BigInt(id)),
        },
        financialYear,
        creditAccount: "借入金",
        transactionType: "income",
      },
    });

    return Number(result._sum.creditAmount) || 0;
  }

  async getBorrowingExpenseTotal(
    politicalOrganizationIds: string[],
    financialYear: number,
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      _sum: {
        debitAmount: true,
      },
      where: {
        politicalOrganizationId: {
          in: politicalOrganizationIds.map((id) => BigInt(id)),
        },
        financialYear,
        debitAccount: "借入金",
        transactionType: "expense",
      },
    });

    return Number(result._sum.debitAmount) || 0;
  }

  async getLastUpdatedAt(): Promise<Date | null> {
    const result = await this.prisma.transaction.aggregate({
      _max: {
        updatedAt: true,
      },
    });

    const updatedAt = result._max.updatedAt;
    return updatedAt ? new Date(updatedAt) : null;
  }

  private aggregateByCategory(
    accountData: Array<{ account: string; amount: number }>,
  ): TransactionCategoryAggregation[] {
    const categoryMap = new Map<
      string,
      { category: string; subcategory?: string; totalAmount: number }
    >();

    for (const item of accountData) {
      const mapping = ACCOUNT_CATEGORY_MAPPING[item.account] || {
        category: item.account,
      };
      const key = mapping.subcategory
        ? `${mapping.category}|${mapping.subcategory}`
        : mapping.category;

      const existing = categoryMap.get(key);
      if (existing) {
        existing.totalAmount += item.amount;
      } else {
        categoryMap.set(key, {
          category: mapping.category,
          subcategory: mapping.subcategory,
          totalAmount: item.amount,
        });
      }
    }

    return Array.from(categoryMap.values());
  }

  private aggregateByCategoryWithTag(
    accountData: Array<{ account: string; tag: string; amount: number }>,
  ): TransactionCategoryAggregation[] {
    const categoryMap = new Map<
      string,
      { category: string; subcategory?: string; totalAmount: number }
    >();

    for (const item of accountData) {
      const mapping = ACCOUNT_CATEGORY_MAPPING[item.account] || {
        category: item.account,
      };
      // friendlyカテゴリーの場合は、subcategoryをtagに置き換える
      const subcategory = item.tag || undefined;
      const key = subcategory
        ? `${mapping.category}|${subcategory}`
        : mapping.category;

      const existing = categoryMap.get(key);
      if (existing) {
        existing.totalAmount += item.amount;
      } else {
        categoryMap.set(key, {
          category: mapping.category,
          subcategory: subcategory,
          totalAmount: item.amount,
        });
      }
    }

    return Array.from(categoryMap.values());
  }

  private buildWhereClause(
    filters?: TransactionFilters,
  ): Prisma.TransactionWhereInput {
    const where: Prisma.TransactionWhereInput = {};

    // webapp では常に offset 系のトランザクションを除外
    where.transactionType = {
      in: ["income", "expense"] as DisplayTransactionType[],
    };

    // フィルターで特定の transaction_type が指定されている場合は上書き
    if (filters?.transaction_type) {
      where.transactionType = filters.transaction_type;
    }

    if (filters?.debit_account) {
      where.debitAccount = {
        contains: filters.debit_account,
        mode: "insensitive",
      };
    }

    if (filters?.credit_account) {
      where.creditAccount = {
        contains: filters.credit_account,
        mode: "insensitive",
      };
    }

    if (filters?.political_organization_id) {
      where.politicalOrganizationId = BigInt(filters.political_organization_id);
    }

    if (filters?.political_organization_ids) {
      where.politicalOrganizationId = {
        in: filters.political_organization_ids.map((id) => BigInt(id)),
      };
    }

    if (filters?.financial_year) {
      where.financialYear = filters.financial_year;
    }

    if (filters?.date_from || filters?.date_to) {
      where.transactionDate = {};
      if (filters.date_from) {
        where.transactionDate.gte = filters.date_from;
      }
      if (filters.date_to) {
        where.transactionDate.lte = filters.date_to;
      }
    }

    // Filter by category keys
    if (filters?.category_keys && filters.category_keys.length > 0) {
      where.categoryKey = { in: filters.category_keys };
    }

    return where;
  }

  private buildOrderByClause(
    sortBy?: "date" | "amount",
    order?: "asc" | "desc",
  ): Prisma.TransactionOrderByWithRelationInput {
    const sortOrder = order || "desc";

    if (sortBy === "amount") {
      // In double-entry bookkeeping, debitAmount and creditAmount are usually equal
      // We'll sort by debitAmount since it represents the transaction value
      return { debitAmount: sortOrder };
    }

    // Default to sorting by date
    return { transactionDate: sortOrder };
  }

  private mapToTransaction(prismaTransaction: PrismaTransaction): Transaction {
    return {
      id: prismaTransaction.id.toString(),
      political_organization_id:
        prismaTransaction.politicalOrganizationId.toString(),
      transaction_no: prismaTransaction.transactionNo || "",
      transaction_date: prismaTransaction.transactionDate,
      financial_year: prismaTransaction.financialYear,
      transaction_type: prismaTransaction.transactionType as TransactionType,
      debit_account: prismaTransaction.debitAccount,
      debit_sub_account: prismaTransaction.debitSubAccount ?? undefined,
      debit_department: prismaTransaction.debitDepartment ?? undefined,
      debit_partner: prismaTransaction.debitPartner ?? undefined,
      debit_tax_category: prismaTransaction.debitTaxCategory ?? undefined,
      debit_amount: Number(prismaTransaction.debitAmount),
      credit_account: prismaTransaction.creditAccount,
      credit_sub_account: prismaTransaction.creditSubAccount ?? undefined,
      credit_department: prismaTransaction.creditDepartment ?? undefined,
      credit_partner: prismaTransaction.creditPartner ?? undefined,
      credit_tax_category: prismaTransaction.creditTaxCategory ?? undefined,
      credit_amount: Number(prismaTransaction.creditAmount),
      description: prismaTransaction.description ?? undefined,
      friendly_category: prismaTransaction.friendlyCategory ?? "",
      memo: prismaTransaction.memo ?? undefined,
      category_key: prismaTransaction.categoryKey,
      label: prismaTransaction.label,
      created_at: prismaTransaction.createdAt,
      updated_at: prismaTransaction.updatedAt,
    };
  }

  private mapToTransactionWithOrganization(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaTransaction: any,
  ): TransactionWithOrganization {
    const base = this.mapToTransaction(prismaTransaction);
    return {
      ...base,
      political_organization_name:
        prismaTransaction.politicalOrganization?.name,
    };
  }
}
