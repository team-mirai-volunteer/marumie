"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { PrismaBalanceSnapshotRepository } from "../repositories/prisma-balance-snapshot.repository";
import { DeleteBalanceSnapshotUsecase } from "../usecases/delete-balance-snapshot-usecase";

export async function deleteBalanceSnapshot(id: string) {
  try {
    if (!id.trim()) {
      throw new Error("残高スナップショットIDは必須です");
    }

    const repository = new PrismaBalanceSnapshotRepository(prisma);
    const usecase = new DeleteBalanceSnapshotUsecase(repository);

    await usecase.execute(id);

    revalidatePath("/balance-snapshots");
    return { success: true };
  } catch (error) {
    console.error("Error deleting balance snapshot:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "残高スナップショットの削除に失敗しました",
    );
  }
}
