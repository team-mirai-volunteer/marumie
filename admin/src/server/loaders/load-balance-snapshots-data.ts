import "server-only";

import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import type { BalanceSnapshot } from "@/shared/models/balance-snapshot";
import { PrismaBalanceSnapshotRepository } from "../repositories/prisma-balance-snapshot.repository";
import { GetBalanceSnapshotsUsecase } from "../usecases/get-balance-snapshots-usecase";

const prisma = new PrismaClient();
const CACHE_REVALIDATE_SECONDS = 60;

export const loadBalanceSnapshotsData = unstable_cache(
  async (politicalOrganizationId?: string): Promise<BalanceSnapshot[]> => {
    try {
      const repository = new PrismaBalanceSnapshotRepository(prisma);
      const usecase = new GetBalanceSnapshotsUsecase(repository);

      const filters = politicalOrganizationId
        ? { political_organization_id: politicalOrganizationId }
        : undefined;

      return await usecase.execute(filters);
    } catch (error) {
      console.error("Error fetching balance snapshots:", error);
      throw new Error("残高スナップショットの取得に失敗しました");
    }
  },
  ["balance-snapshots-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
