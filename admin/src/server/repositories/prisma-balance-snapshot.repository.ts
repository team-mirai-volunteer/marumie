import type { PrismaClient } from "@prisma/client";
import type {
  BalanceSnapshot,
  CreateBalanceSnapshotInput,
} from "@/shared/models/balance-snapshot";
import type { IBalanceSnapshotRepository } from "./interfaces/balance-snapshot-repository.interface";

export class PrismaBalanceSnapshotRepository
  implements IBalanceSnapshotRepository
{
  constructor(private prisma: PrismaClient) {}

  async create(input: CreateBalanceSnapshotInput): Promise<BalanceSnapshot> {
    const balanceSnapshot = await this.prisma.balanceSnapshot.create({
      data: {
        politicalOrganizationId: BigInt(input.political_organization_id),
        snapshotDate: input.snapshot_date,
        balance: input.balance,
      },
    });

    return this.mapToBalanceSnapshot(balanceSnapshot);
  }

  private mapToBalanceSnapshot(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaBalanceSnapshot: any,
  ): BalanceSnapshot {
    return {
      id: prismaBalanceSnapshot.id.toString(),
      political_organization_id:
        prismaBalanceSnapshot.politicalOrganizationId.toString(),
      snapshot_date: prismaBalanceSnapshot.snapshotDate,
      balance: Number(prismaBalanceSnapshot.balance),
      created_at: prismaBalanceSnapshot.createdAt,
      updated_at: prismaBalanceSnapshot.updatedAt,
    };
  }
}
