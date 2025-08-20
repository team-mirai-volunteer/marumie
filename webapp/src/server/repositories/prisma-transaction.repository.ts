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
  ): Promise<SankeyCategoryAggregationResult> {
    // 収入の集計（account別）
    const incomeAggregation = await this.prisma.transaction.groupBy({
      by: ["creditAccount"],
      where: {
        politicalOrganizationId: BigInt(politicalOrganizationId),
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
        politicalOrganizationId: BigInt(politicalOrganizationId),
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
