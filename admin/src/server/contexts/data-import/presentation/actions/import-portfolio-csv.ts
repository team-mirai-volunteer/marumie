"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/contexts/shared/infrastructure/prisma";
import { PortfolioCsvLoader } from "@/server/contexts/data-import/infrastructure/portfolio-csv/portfolio-csv-loader";
import { ImportPortfolioCsvUsecase } from "@/server/contexts/data-import/application/usecases/import-portfolio-csv-usecase";

export interface ImportPortfolioCsvRequest {
  csvContent: string;
  politicalOrganizationId: string;
}

export type ImportPortfolioCsvResult =
  | { ok: true; importedCount: number }
  | { ok: false; error: string };

export async function importPortfolioCsv(
  data: ImportPortfolioCsvRequest,
): Promise<ImportPortfolioCsvResult> {
  try {
    const { csvContent, politicalOrganizationId } = data;

    if (!csvContent) {
      return { ok: false, error: "CSVコンテンツが指定されていません" };
    }

    if (!politicalOrganizationId) {
      return { ok: false, error: "政治団体IDが指定されていません" };
    }

    const csvLoader = new PortfolioCsvLoader();
    const usecase = new ImportPortfolioCsvUsecase(csvLoader, prisma);

    const result = await usecase.execute({ csvContent, politicalOrganizationId });

    revalidatePath("/import-portfolio");

    return { ok: true, importedCount: result.importedCount };
  } catch (error) {
    console.error("Import Portfolio CSV error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      return {
        ok: false,
        error: "データベースへの保存に失敗しました。時間をおいて再試行してください",
      };
    }

    return {
      ok: false,
      error: error instanceof Error ? error.message : "予期しないエラーが発生しました",
    };
  }
}
