import type {
  Prisma,
  PrismaClient,
  Transaction as PrismaTransaction,
} from "@prisma/client";
import type {
  Transaction,
  TransactionFilters,
} from "@/shared/models/transaction";
import { ACCOUNT_CATEGORY_MAPPING } from "@/shared/utils/category-mapping";
import type {
  ITransactionRepository,
  MonthlyAggregation,
  PaginatedResult,
  PaginationOptions,
  SankeyCategoryAggregationResult,
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

  async findWithPagination(
    filters?: TransactionFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Transaction>> {
    const where = this.buildWhereClause(filters);

    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 50;
    const skip = (page - 1) * perPage;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { transactionDate: "desc" },
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

  async getCategoryAggregationForSankey(
    politicalOrganizationId: string,
    financialYear: number,
  ): Promise<SankeyCategoryAggregationResult> {
    const baseWhere = {
      politicalOrganizationId: BigInt(politicalOrganizationId),
      financialYear,
    };

    // 収入の集計（account別）
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

    // 支出の集計（account別）
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

  async getMonthlyAggregation(
    politicalOrganizationId: string,
    financialYear: number,
  ): Promise<MonthlyAggregation[]> {
    const [incomeResults, expenseResults] = await Promise.all([
      this.prisma.$queryRaw<
        Array<{ year: bigint; month: bigint; total_amount: number }>
      >`
        SELECT 
          EXTRACT(YEAR FROM transaction_date) as year,
          EXTRACT(MONTH FROM transaction_date) as month,
          SUM(credit_amount) as total_amount
        FROM transactions 
        WHERE political_organization_id = ${BigInt(politicalOrganizationId)}
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
        WHERE political_organization_id = ${BigInt(politicalOrganizationId)}
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

    // 結果を配列に変換して年月順でソート
    return Array.from(monthlyMap.values()).sort((a, b) =>
      a.yearMonth.localeCompare(b.yearMonth),
    );
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

  private buildWhereClause(
    filters?: TransactionFilters,
  ): Prisma.TransactionWhereInput {
    const where: Prisma.TransactionWhereInput = {};

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

    return where;
  }

  private mapToTransaction(prismaTransaction: PrismaTransaction): Transaction {
    return {
      id: prismaTransaction.id.toString(),
      political_organization_id:
        prismaTransaction.politicalOrganizationId.toString(),
      transaction_no: prismaTransaction.transactionNo ?? undefined,
      transaction_date: prismaTransaction.transactionDate,
      financial_year: prismaTransaction.financialYear,
      transaction_type: prismaTransaction.transactionType,
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
      description_1: prismaTransaction.description1 ?? undefined,
      description_2: prismaTransaction.description2 ?? undefined,
      description_3: prismaTransaction.description3 ?? undefined,
      description_detail: prismaTransaction.descriptionDetail ?? undefined,
      tags: prismaTransaction.tags ?? undefined,
      memo: prismaTransaction.memo ?? undefined,
      created_at: prismaTransaction.createdAt,
      updated_at: prismaTransaction.updatedAt,
    };
  }
}
