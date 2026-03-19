"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/server/contexts/shared/infrastructure/prisma";
import { PrismaTransactionRepository } from "@/server/contexts/shared/infrastructure/repositories/prisma-transaction.repository";

export async function deleteTransactionAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const repository = new PrismaTransactionRepository(prisma);
    await repository.delete(id);

    updateTag("transactions-data");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
