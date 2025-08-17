import prisma from '@poli-money-alpha/db';
import type { PrismaClient } from '@prisma/client';
import {
  PoliticalOrganization,
  CreatePoliticalOrganizationRequest,
  UpdatePoliticalOrganizationRequest,
  PoliticalOrganizationWithTransactionCount
} from '@/shared/model/political-organization';

export interface IPoliticalOrganizationRepository {
  findAll(): Promise<PoliticalOrganization[]>;
  findAllWithTransactionCount(): Promise<PoliticalOrganizationWithTransactionCount[]>;
  findById(id: bigint): Promise<PoliticalOrganization | null>;
  create(data: CreatePoliticalOrganizationRequest): Promise<PoliticalOrganization>;
  update(id: bigint, data: UpdatePoliticalOrganizationRequest): Promise<PoliticalOrganization>;
  delete(id: bigint): Promise<void>;
  exists(id: bigint): Promise<boolean>;
}

export class PoliticalOrganizationRepository implements IPoliticalOrganizationRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<PoliticalOrganization[]> {
    return await this.prisma.politicalOrganization.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAllWithTransactionCount(): Promise<PoliticalOrganizationWithTransactionCount[]> {
    const organizations = await this.prisma.politicalOrganization.findMany({
      include: {
        _count: {
          select: { transactions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return organizations.map((org) => ({
      id: org.id,
      name: org.name,
      description: org.description,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
      transactionCount: org._count.transactions
    }));
  }

  async findById(id: bigint): Promise<PoliticalOrganization | null> {
    return await this.prisma.politicalOrganization.findUnique({
      where: { id }
    });
  }

  async create(data: CreatePoliticalOrganizationRequest): Promise<PoliticalOrganization> {
    return await this.prisma.politicalOrganization.create({
      data
    });
  }

  async update(id: bigint, data: UpdatePoliticalOrganizationRequest): Promise<PoliticalOrganization> {
    return await this.prisma.politicalOrganization.update({
      where: { id },
      data
    });
  }

  async delete(id: bigint): Promise<void> {
    await this.prisma.politicalOrganization.delete({
      where: { id }
    });
  }

  async exists(id: bigint): Promise<boolean> {
    const count = await this.prisma.politicalOrganization.count({
      where: { id }
    });
    return count > 0;
  }
}
