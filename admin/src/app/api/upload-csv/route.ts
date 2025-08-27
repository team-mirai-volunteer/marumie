import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import { UploadMfCsvUsecase } from "@/server/usecases/upload-mf-csv-usecase";

export const runtime = "nodejs";

const prisma = new PrismaClient();
const transactionRepository = new PrismaTransactionRepository(prisma);
const uploadUsecase = new UploadMfCsvUsecase(transactionRepository);

export async function POST(request: Request) {
  try {
    const { validTransactions } = await request.json();

    if (!validTransactions || !Array.isArray(validTransactions)) {
      return NextResponse.json(
        { error: "有効なトランザクションデータが指定されていません" },
        { status: 400 },
      );
    }

    const result = await uploadUsecase.execute({
      validTransactions,
    });

    if (result.errors.length > 0) {
      return NextResponse.json(
        {
          error: "処理中にエラーが発生しました",
          details: result.errors,
          processedCount: result.processedCount,
          savedCount: result.savedCount,
          skippedCount: result.skippedCount,
          message: `${result.processedCount}件を処理し、${result.savedCount}件を保存、${result.skippedCount}件をスキップしました`,
        },
        { status: 400 },
      );
    }

    const message =
      result.skippedCount > 0
        ? `${result.processedCount}件を処理し、${result.savedCount}件を新規保存、${result.skippedCount}件を重複のためスキップしました`
        : `${result.processedCount}件を処理し、${result.savedCount}件を保存しました`;

    // Refresh webapp cache after successful upload
    if (result.savedCount > 0) {
      try {
        const webappUrl = process.env.WEBAPP_URL || "http://localhost:3000";
        const refreshToken = process.env.DATA_REFRESH_TOKEN;
        
        if (refreshToken) {
          await fetch(`${webappUrl}/api/refresh`, {
            method: "POST",
            headers: {
              "x-refresh-token": refreshToken,
            },
          });
        }
      } catch (refreshError) {
        console.warn("Failed to refresh webapp cache:", refreshError);
        // Don't fail the upload if cache refresh fails
      }
    }

    return NextResponse.json({
      ok: true,
      processedCount: result.processedCount,
      savedCount: result.savedCount,
      skippedCount: result.skippedCount,
      message,
    });
  } catch (error) {
    console.error("Upload CSV error:", error);
    return NextResponse.json(
      {
        error: "サーバー内部エラーが発生しました",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
