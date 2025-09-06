import "server-only";
import type { PrismaClient } from "@prisma/client";
import type { IBalanceSnapshotRepository } from "./interfaces/balance-snapshot-repository.interface";

export class PrismaBalanceSnapshotRepository
  implements IBalanceSnapshotRepository
{
  constructor(private prisma: PrismaClient) {}

  async getTotalLatestBalanceByOrgIds(orgIds: string[]): Promise<number> {
    if (orgIds.length === 0) {
      return 0;
    }

    // 各org_idごとに最新のスナップショットの残高の合計を取得
    const result = await this.prisma.$queryRaw<
      Array<{
        total_balance: string;
      }>
    >`
      SELECT COALESCE(SUM(latest_balances.balance), 0)::text as total_balance
      FROM (
        SELECT DISTINCT ON (political_organization_id)
          balance
        FROM balance_snapshots
        WHERE political_organization_id = ANY(${orgIds.map((id) => BigInt(id))})
        ORDER BY political_organization_id, snapshot_date DESC, updated_at DESC
      ) as latest_balances
    `;

    return Number(result[0]?.total_balance || 0);
  }
}
