import type { Prisma, PrismaClient } from "@prisma/client";
import type {
  Transaction,
  TransactionFilters,
} from "@/shared/models/transaction";
import type {
  ITransactionRepository,
  PaginatedResult,
  PaginationOptions,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToTransaction(prismaTransaction: any): Transaction {
    return {
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
      description_1: prismaTransaction.description1,
      description_2: prismaTransaction.description2,
      description_3: prismaTransaction.description3,
      description_detail: prismaTransaction.descriptionDetail,
      tags: prismaTransaction.tags,
      memo: prismaTransaction.memo,
      created_at: prismaTransaction.createdAt,
      updated_at: prismaTransaction.updatedAt,
    };
  }
}