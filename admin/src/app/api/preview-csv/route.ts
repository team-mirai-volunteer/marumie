import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { EncodingConverter } from "@/server/lib/encoding-converter";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import { PreviewMfCsvUsecase } from "@/server/usecases/preview-mf-csv-usecase";

export const runtime = "nodejs";

const prisma = new PrismaClient();
const transactionRepository = new PrismaTransactionRepository(prisma);
const previewUsecase = new PreviewMfCsvUsecase(transactionRepository);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const politicalOrganizationId = formData.get("politicalOrganizationId") as
      | string
      | null;

    if (!file) {
      return NextResponse.json(
        { error: "ファイルが選択されていません" },
        { status: 400 },
      );
    }

    if (!politicalOrganizationId) {
      return NextResponse.json(
        { error: "政治団体IDが指定されていません" },
        { status: 400 },
      );
    }

    // Convert file to buffer and then to properly encoded string
    const csvBuffer = Buffer.from(await file.arrayBuffer());
    const csvContent = EncodingConverter.bufferToString(csvBuffer);

    const result = await previewUsecase.execute({
      csvContent,
      politicalOrganizationId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Preview CSV error:", error);
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