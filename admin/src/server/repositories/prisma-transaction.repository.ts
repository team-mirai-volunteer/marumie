import type { Prisma, PrismaClient } from "@prisma/client";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionFilters,
  UpdateTransactionInput,
} from "@/shared/models/transaction";
import type { TransactionWithOrganization } from "@/server/usecases/get-transactions-usecase";
import type {
  ITransactionRepository,
  PaginatedResult,
  PaginationOptions,
} from "./interfaces/transaction-repository.interface";

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const transaction = await this.prisma.transaction.create({
      data: {
        politicalOrganizationId: BigInt(input.political_organization_id),
        transactionNo: input.transaction_no,
        transactionDate: input.transaction_date,
        financialYear: input.financial_year,
        transactionType: input.transaction_type,
        debitAccount: input.debit_account,
        debitSubAccount: input.debit_sub_account || null,
        debitDepartment: input.debit_department || null,
        debitPartner: input.debit_partner || null,
        debitTaxCategory: input.debit_tax_category || null,
        debitAmount: input.debit_amount,
        creditAccount: input.credit_account,
        creditSubAccount: input.credit_sub_account || null,
        creditDepartment: input.credit_department || null,
        creditPartner: input.credit_partner || null,
        creditTaxCategory: input.credit_tax_category || null,
        creditAmount: input.credit_amount,
        description: input.description || "",
        label: input.label || "",
        friendlyCategory: input.friendly_category || "",
        memo: input.memo || null,
        categoryKey: input.category_key,
      },
      include: {
        politicalOrganization: true,
      },
    });

    return this.mapToTransaction(transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: BigInt(id) },
      include: {
        politicalOrganization: true,
      },
    });

    return transaction ? this.mapToTransaction(transaction) : null;
  }

  async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const where = this.buildWhereClause(filters);

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { transactionDate: "desc" },
      include: {
        politicalOrganization: true,
      },
    });

    return transactions.map((t) => this.mapToTransaction(t));
  }

  async findWithPagination(
    filters?: TransactionFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<TransactionWithOrganization>> {
    const where = this.buildWhereClause(filters);

    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 50;
    const skip = (page - 1) * perPage;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          politicalOrganization: true,
        },
        orderBy: { transactionDate: "desc" },
        skip,
        take: perPage,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return {
      items: transactions.map((t) => this.mapToTransaction(t, true)),
      total,
      page,
      perPage,
      totalPages,
    };
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

  async update(
    _id: string,
    _input: UpdateTransactionInput,
  ): Promise<Transaction> {
    throw new Error("Transaction update is not implemented");
  }

  async delete(_id: string): Promise<void> {
    throw new Error("Transaction delete is not implemented");
  }

  async deleteAll(filters?: TransactionFilters): Promise<number> {
    const where = this.buildWhereClause(filters);

    const result = await this.prisma.transaction.deleteMany({
      where,
    });

    return result.count;
  }

  async createMany(inputs: CreateTransactionInput[]): Promise<Transaction[]> {
    const data = inputs.map((input, index) => {
      try {
        return {
          politicalOrganizationId: BigInt(input.political_organization_id),
          transactionNo: input.transaction_no,
          transactionDate: input.transaction_date,
          financialYear: input.financial_year,
          transactionType: input.transaction_type,
          debitAccount: input.debit_account,
          debitSubAccount: input.debit_sub_account || null,
          debitDepartment: input.debit_department || null,
          debitPartner: input.debit_partner || null,
          debitTaxCategory: input.debit_tax_category || null,
          debitAmount: input.debit_amount,
          creditAccount: input.credit_account,
          creditSubAccount: input.credit_sub_account || null,
          creditDepartment: input.credit_department || null,
          creditPartner: input.credit_partner || null,
          creditTaxCategory: input.credit_tax_category || null,
          creditAmount: input.credit_amount,
          description: input.description || null,
          label: input.label || "",
          friendlyCategory: input.friendly_category,
          memo: input.memo || null,
          categoryKey: input.category_key,
        };
      } catch (error) {
        throw new Error(
          `Failed to convert transaction ${index}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    });

    await this.prisma.transaction.createMany({
      data,
    });

    const createdTransactions = await this.prisma.transaction.findMany({
      where: {
        transactionNo: {
          in: inputs
            .map((input) => input.transaction_no)
            .filter((no): no is string => Boolean(no)),
        },
      },
      orderBy: { createdAt: "desc" },
      take: inputs.length,
      include: {
        politicalOrganization: true,
      },
    });

    return createdTransactions.map((t) => this.mapToTransaction(t));
  }

  async createManySkipDuplicates(inputs: CreateTransactionInput[]): Promise<{
    created: Transaction[];
    skipped: number;
  }> {
    // 既存のtransaction_noを取得
    const transactionNos = inputs
      .map((input) => input.transaction_no)
      .filter(Boolean) as string[];

    const existingTransactions = await this.prisma.transaction.findMany({
      where: {
        transactionNo: {
          in: transactionNos,
        },
      },
      select: {
        transactionNo: true,
      },
    });

    const existingTransactionNos = new Set(
      existingTransactions.map((t) => t.transactionNo).filter(Boolean),
    );

    // 重複していないものだけをフィルタリング
    const newInputs = inputs.filter(
      (input) =>
        !input.transaction_no ||
        !existingTransactionNos.has(input.transaction_no),
    );

    const skippedCount = inputs.length - newInputs.length;

    if (newInputs.length === 0) {
      return {
        created: [],
        skipped: skippedCount,
      };
    }

    // 新しいレコードを作成
    const createdTransactions = await this.createMany(newInputs);

    return {
      created: createdTransactions,
      skipped: skippedCount,
    };
  }

  async findByTransactionNos(transactionNos: string[]): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        transactionNo: {
          in: transactionNos,
        },
      },
      include: {
        politicalOrganization: true,
      },
    });

    return transactions.map((t) => this.mapToTransaction(t));
  }

  async checkDuplicateTransactionNos(
    politicalOrgId: string,
    transactionNos: string[],
  ): Promise<string[]> {
    if (transactionNos.length === 0) {
      return [];
    }

    const existingTransactions = await this.prisma.transaction.findMany({
      where: {
        politicalOrganizationId: BigInt(politicalOrgId),
        transactionNo: {
          in: transactionNos,
        },
      },
      select: {
        transactionNo: true,
      },
    });

    return existingTransactions
      .map((t) => t.transactionNo)
      .filter((no): no is string => no !== null);
  }

  public mapToTransaction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaTransaction: any,
    includeOrganization = false,
  ): Transaction | TransactionWithOrganization {
    const base: Transaction = {
      id: prismaTransaction.id.toString(),
      political_organization_id:
        prismaTransaction.politicalOrganizationId.toString(),
      transaction_no: prismaTransaction.transactionNo,
      transaction_date: prismaTransaction.transactionDate,
      financial_year: prismaTransaction.financialYear,
      transaction_type: prismaTransaction.transactionType,
      debit_account: prismaTransaction.debitAccount,
      debit_sub_account: prismaTransaction.debitSubAccount,
      debit_department: prismaTransaction.debitDepartment,
      debit_partner: prismaTransaction.debitPartner,
      debit_tax_category: prismaTransaction.debitTaxCategory,
      debit_amount: Number(prismaTransaction.debitAmount),
      credit_account: prismaTransaction.creditAccount,
      credit_sub_account: prismaTransaction.creditSubAccount,
      credit_department: prismaTransaction.creditDepartment,
      credit_partner: prismaTransaction.creditPartner,
      credit_tax_category: prismaTransaction.creditTaxCategory,
      credit_amount: Number(prismaTransaction.creditAmount),
      description: prismaTransaction.description,
      friendly_category: prismaTransaction.friendlyCategory,
      memo: prismaTransaction.memo,
      category_key: prismaTransaction.categoryKey,
      label: prismaTransaction.label,
      created_at: prismaTransaction.createdAt,
      updated_at: prismaTransaction.updatedAt,
      political_organization_name:
        prismaTransaction.politicalOrganization?.name || "Unknown Organization",
    };

    if (includeOrganization) {
      return {
        ...base,
        political_organization_name:
          prismaTransaction.politicalOrganization?.name ||
          "Unknown Organization",
      } as TransactionWithOrganization;
    }

    return base;
  }
}
