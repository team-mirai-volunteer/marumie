import { PrismaClient } from '@prisma/client';
import {
  ITransactionRepository,
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
} from './interfaces/transaction-repository.interface';

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const transaction = await this.prisma.transaction.create({
      data: {
        transaction_no: input.transaction_no,
        transaction_date: input.transaction_date,
        transaction_type: input.transaction_type,
        debit_account: input.debit_account,
        debit_sub_account: input.debit_sub_account,
        debit_department: input.debit_department,
        debit_partner: input.debit_partner,
        debit_tax_category: input.debit_tax_category,
        debit_invoice: input.debit_invoice,
        debit_amount: input.debit_amount,
        credit_account: input.credit_account,
        credit_sub_account: input.credit_sub_account,
        credit_department: input.credit_department,
        credit_partner: input.credit_partner,
        credit_tax_category: input.credit_tax_category,
        credit_invoice: input.credit_invoice,
        credit_amount: input.credit_amount,
        description: input.description,
        tags: input.tags,
        memo: input.memo,
      },
    });

    return this.mapToTransaction(transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    return transaction ? this.mapToTransaction(transaction) : null;
  }

  async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const where: any = {};

    if (filters?.transaction_type) {
      where.transaction_type = filters.transaction_type;
    }

    if (filters?.debit_account) {
      where.debit_account = {
        contains: filters.debit_account,
        mode: 'insensitive',
      };
    }

    if (filters?.credit_account) {
      where.credit_account = {
        contains: filters.credit_account,
        mode: 'insensitive',
      };
    }

    if (filters?.date_from || filters?.date_to) {
      where.transaction_date = {};
      if (filters.date_from) {
        where.transaction_date.gte = filters.date_from;
      }
      if (filters.date_to) {
        where.transaction_date.lte = filters.date_to;
      }
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { transaction_date: 'desc' },
    });

    return transactions.map(this.mapToTransaction);
  }

  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...(input.transaction_no && { transaction_no: input.transaction_no }),
        ...(input.transaction_date && { transaction_date: input.transaction_date }),
        ...(input.transaction_type && { transaction_type: input.transaction_type }),
        ...(input.debit_account && { debit_account: input.debit_account }),
        ...(input.debit_sub_account !== undefined && { debit_sub_account: input.debit_sub_account }),
        ...(input.debit_department !== undefined && { debit_department: input.debit_department }),
        ...(input.debit_partner !== undefined && { debit_partner: input.debit_partner }),
        ...(input.debit_tax_category !== undefined && { debit_tax_category: input.debit_tax_category }),
        ...(input.debit_invoice !== undefined && { debit_invoice: input.debit_invoice }),
        ...(input.debit_amount !== undefined && { debit_amount: input.debit_amount }),
        ...(input.credit_account && { credit_account: input.credit_account }),
        ...(input.credit_sub_account !== undefined && { credit_sub_account: input.credit_sub_account }),
        ...(input.credit_department !== undefined && { credit_department: input.credit_department }),
        ...(input.credit_partner !== undefined && { credit_partner: input.credit_partner }),
        ...(input.credit_tax_category !== undefined && { credit_tax_category: input.credit_tax_category }),
        ...(input.credit_invoice !== undefined && { credit_invoice: input.credit_invoice }),
        ...(input.credit_amount !== undefined && { credit_amount: input.credit_amount }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.tags !== undefined && { tags: input.tags }),
        ...(input.memo !== undefined && { memo: input.memo }),
      },
    });

    return this.mapToTransaction(transaction);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }

  async createMany(inputs: CreateTransactionInput[]): Promise<Transaction[]> {
    const data = inputs.map(input => ({
      transaction_no: input.transaction_no,
      transaction_date: input.transaction_date,
      transaction_type: input.transaction_type,
      debit_account: input.debit_account,
      debit_sub_account: input.debit_sub_account,
      debit_department: input.debit_department,
      debit_partner: input.debit_partner,
      debit_tax_category: input.debit_tax_category,
      debit_invoice: input.debit_invoice,
      debit_amount: input.debit_amount,
      credit_account: input.credit_account,
      credit_sub_account: input.credit_sub_account,
      credit_department: input.credit_department,
      credit_partner: input.credit_partner,
      credit_tax_category: input.credit_tax_category,
      credit_invoice: input.credit_invoice,
      credit_amount: input.credit_amount,
      description: input.description,
      tags: input.tags,
      memo: input.memo,
    }));

    await this.prisma.transaction.createMany({
      data,
    });

    const createdTransactions = await this.prisma.transaction.findMany({
      where: {
        transaction_no: {
          in: inputs.map(input => input.transaction_no),
        },
      },
      orderBy: { created_at: 'desc' },
      take: inputs.length,
    });

    return createdTransactions.map(this.mapToTransaction);
  }

  private mapToTransaction(prismaTransaction: any): Transaction {
    return {
      id: prismaTransaction.id.toString(),
      transaction_no: prismaTransaction.transaction_no,
      transaction_date: prismaTransaction.transaction_date,
      transaction_type: prismaTransaction.transaction_type,
      debit_account: prismaTransaction.debit_account,
      debit_sub_account: prismaTransaction.debit_sub_account,
      debit_department: prismaTransaction.debit_department,
      debit_partner: prismaTransaction.debit_partner,
      debit_tax_category: prismaTransaction.debit_tax_category,
      debit_invoice: prismaTransaction.debit_invoice,
      debit_amount: prismaTransaction.debit_amount,
      credit_account: prismaTransaction.credit_account,
      credit_sub_account: prismaTransaction.credit_sub_account,
      credit_department: prismaTransaction.credit_department,
      credit_partner: prismaTransaction.credit_partner,
      credit_tax_category: prismaTransaction.credit_tax_category,
      credit_invoice: prismaTransaction.credit_invoice,
      credit_amount: prismaTransaction.credit_amount,
      description: prismaTransaction.description,
      tags: prismaTransaction.tags,
      memo: prismaTransaction.memo,
      created_at: prismaTransaction.created_at,
      updated_at: prismaTransaction.updated_at,
    };
  }
}