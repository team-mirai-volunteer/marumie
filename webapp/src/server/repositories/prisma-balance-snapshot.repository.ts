import "server-only";
import type { PrismaClient } from "@prisma/client";

export interface IBalanceSnapshotRepository {
  findLatestByOrgIds(orgIds: string[]): Promise<BalanceSnapshotData[]>;
}

export interface BalanceSnapshotData {
  id: string;
  political_organization_id: string;
  snapshot_date: Date;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export class PrismaBalanceSnapshotRepository
  implements IBalanceSnapshotRepository
{
  constructor(private prisma: PrismaClient) {}

  async findLatestByOrgIds(orgIds: string[]): Promise<BalanceSnapshotData[]> {
    if (orgIds.length === 0) {
      return [];
    }

    // 各org_idごとに最新のスナップショットを取得
    const latestSnapshots = await this.prisma.$queryRaw<
      Array<{
        id: bigint;
        political_organization_id: bigint;
        snapshot_date: Date;
        balance: any;
        created_at: Date;
        updated_at: Date;
      }>
    >`
      SELECT DISTINCT ON (political_organization_id) 
        id,
        political_organization_id,
        snapshot_date,
        balance,
        created_at,
        updated_at
      FROM balance_snapshots 
      WHERE political_organization_id = ANY(${orgIds.map((id) => BigInt(id))})
      ORDER BY political_organization_id, snapshot_date DESC, updated_at DESC
    `;

    return latestSnapshots.map((snapshot) => ({
      id: snapshot.id.toString(),
      political_organization_id: snapshot.political_organization_id.toString(),
      snapshot_date: snapshot.snapshot_date,
      balance: Number(snapshot.balance),
      created_at: snapshot.created_at,
      updated_at: snapshot.updated_at,
    }));
  }
}
