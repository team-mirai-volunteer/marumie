import "server-only";

import type { BalanceSnapshot } from "@/shared/models/balance-snapshot";
import { prisma } from "@/server/lib/prisma";
import { PrismaBalanceSnapshotRepository } from "../repositories/prisma-balance-snapshot.repository";

export async function loadBalanceSnapshotsData(
  politicalOrganizationId: string,
): Promise<BalanceSnapshot[]> {
  try {
    const repository = new PrismaBalanceSnapshotRepository(prisma);

    return await repository.findAll({
      political_organization_id: politicalOrganizationId,
    });
  } catch (error) {
    console.error("Error fetching balance snapshots:", error);
    throw new Error("残高スナップショットの取得に失敗しました");
  }
}
