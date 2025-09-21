"use server";

import { revalidateTag } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { PrismaTransactionRepository } from "../repositories/prisma-transaction.repository";
import { DeleteAllTransactionsUsecase } from "../usecases/delete-all-transactions-usecase";

const prisma = new PrismaClient();

export async function deleteAllTransactionsAction(
  organizationId?: string,
): Promise<{
  success: boolean;
  deletedCount?: number;
  error?: string;
}> {
  try {
    const repository = new PrismaTransactionRepository(prisma);
    const usecase = new DeleteAllTransactionsUsecase(repository);

    const result = await usecase.execute(organizationId);

    // データキャッシュを無効化してトランザクション一覧を更新
    revalidateTag("transactions-data");

    return {
      success: true,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
