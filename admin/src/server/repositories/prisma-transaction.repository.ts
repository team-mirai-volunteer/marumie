import { PrismaClient } from '@prisma/client';
import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
} from '@/shared/model/transaction';
import { ITransactionRepository } from './interfaces/transaction-repository.interface';

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
        debitSubAccount: input.debit_sub_account,
        debitDepartment: input.debit_department,
        debitPartner: input.debit_partner,
        debitTaxCategory: input.debit_tax_category,
        debitAmount: input.debit_amount,
        creditAccount: input.credit_account,
        creditSubAccount: input.credit_sub_account,
        creditDepartment: input.credit_department,
        creditPartner: input.credit_partner,
        creditTaxCategory: input.credit_tax_category,
        creditAmount: input.credit_amount,
        description: input.description,
        description1: input.description_1,
        description2: input.description_2,
        description3: input.description_3,
        descriptionDetail: input.description_detail,
      },
    });

    return this.mapToTransaction(transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: BigInt(id) },
    });

    return transaction ? this.mapToTransaction(transaction) : null;
  }

  async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const where: any = {};

    if (filters?.transaction_type) {
      where.transactionType = filters.transaction_type;
    }

    if (filters?.debit_account) {
      where.debitAccount = {
        contains: filters.debit_account,
        mode: 'insensitive',
      };
    }

    if (filters?.credit_account) {
      where.creditAccount = {
        contains: filters.credit_account,
        mode: 'insensitive',
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

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { transactionDate: 'desc' },
    });

    return transactions.map(this.mapToTransaction);
  }

  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const transaction = await this.prisma.transaction.update({
      where: { id: BigInt(id) },
      data: {
        ...(input.political_organization_id && { politicalOrganizationId: BigInt(input.political_organization_id) }),
        ...(input.transaction_no !== undefined && { transactionNo: input.transaction_no }),
        ...(input.transaction_date && { transactionDate: input.transaction_date }),
        ...(input.financial_year !== undefined && { financialYear: input.financial_year }),
        ...(input.transaction_type && { transactionType: input.transaction_type }),
        ...(input.debit_account && { debitAccount: input.debit_account }),
        ...(input.debit_sub_account !== undefined && { debitSubAccount: input.debit_sub_account }),
        ...(input.debit_department !== undefined && { debitDepartment: input.debit_department }),
        ...(input.debit_partner !== undefined && { debitPartner: input.debit_partner }),
        ...(input.debit_tax_category !== undefined && { debitTaxCategory: input.debit_tax_category }),
        ...(input.debit_amount !== undefined && { debitAmount: input.debit_amount }),
        ...(input.credit_account && { creditAccount: input.credit_account }),
        ...(input.credit_sub_account !== undefined && { creditSubAccount: input.credit_sub_account }),
        ...(input.credit_department !== undefined && { creditDepartment: input.credit_department }),
        ...(input.credit_partner !== undefined && { creditPartner: input.credit_partner }),
        ...(input.credit_tax_category !== undefined && { creditTaxCategory: input.credit_tax_category }),
        ...(input.credit_amount !== undefined && { creditAmount: input.credit_amount }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.description_1 !== undefined && { description1: input.description_1 }),
        ...(input.description_2 !== undefined && { description2: input.description_2 }),
        ...(input.description_3 !== undefined && { description3: input.description_3 }),
        ...(input.description_detail !== undefined && { descriptionDetail: input.description_detail }),
      },
    });

    return this.mapToTransaction(transaction);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id: BigInt(id) },
    });
  }

  async createMany(inputs: CreateTransactionInput[]): Promise<Transaction[]> {
    const data = inputs.map(input => ({
      politicalOrganizationId: BigInt(input.political_organization_id),
      transactionNo: input.transaction_no,
      transactionDate: input.transaction_date,
      financialYear: input.financial_year,
      transactionType: input.transaction_type,
      debitAccount: input.debit_account,
      debitSubAccount: input.debit_sub_account,
      debitDepartment: input.debit_department,
      debitPartner: input.debit_partner,
      debitTaxCategory: input.debit_tax_category,
      debitAmount: input.debit_amount,
      creditAccount: input.credit_account,
      creditSubAccount: input.credit_sub_account,
      creditDepartment: input.credit_department,
      creditPartner: input.credit_partner,
      creditTaxCategory: input.credit_tax_category,
      creditAmount: input.credit_amount,
      description: input.description,
      description1: input.description_1,
      description2: input.description_2,
      description3: input.description_3,
      descriptionDetail: input.description_detail,
    }));

    await this.prisma.transaction.createMany({
      data,
    });

    const createdTransactions = await this.prisma.transaction.findMany({
      where: {
        transactionNo: {
          in: inputs.map(input => input.transaction_no).filter(Boolean),
        },
      },
      orderBy: { createdAt: 'desc' },
      take: inputs.length,
    });

    return createdTransactions.map(this.mapToTransaction);
  }

  private mapToTransaction(prismaTransaction: any): Transaction {
    return {
      id: prismaTransaction.id.toString(),
      political_organization_id: prismaTransaction.politicalOrganizationId.toString(),
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
      created_at: prismaTransaction.createdAt,
      updated_at: prismaTransaction.updatedAt,
    };
  }
}