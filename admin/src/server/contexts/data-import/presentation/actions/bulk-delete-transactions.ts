"use server";

import "server-only";
import { updateTag } from "next/cache";
import { prisma } from "@/server/contexts/shared/infrastructure/prisma";
import { WebappCacheInvalidator } from "@/server/contexts/shared/infrastructure/services/webapp-cache-invalidator";

export async function bulkDeleteTransactionsAction(ids: string[]): Promise<{
  success: boolean;
  deletedCount?: number;
  error?: string;
}> {
  try {
    const deletedCount = await prisma.transaction.deleteMany({
      where: {
        id: {
          in: ids.map((id) => BigInt(id)),
        },
      },
    });

    updateTag("transactions-data");
    updateTag("transactions-for-csv");

    const cacheInvalidator = new WebappCacheInvalidator();
    await cacheInvalidator.invalidateWebappCache();

    return {
      success: true,
      deletedCount: deletedCount.count,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "削除中にエラーが発生しました",
    };
  }
}
