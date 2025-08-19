import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import {
  type GetTransactionsBySlugParams,
  GetTransactionsBySlugUsecase,
} from "@/server/usecases/get-transactions-by-slug-usecase";
import { 
  ConvertToSankeyUsecase,
  type ConvertToSankeyParams
} from "@/server/usecases/convert-to-sankey-usecase";

export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const transactionType = searchParams.get("transactionType");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const financialYear = searchParams.get("financialYear");

    // 依存関係の初期化
    const transactionRepository = new PrismaTransactionRepository(prisma);
    const politicalOrganizationRepository =
      new PrismaPoliticalOrganizationRepository(prisma);
    
    // Usecase 1: トランザクション取得
    const getTransactionsUsecase = new GetTransactionsBySlugUsecase(
      transactionRepository,
      politicalOrganizationRepository,
    );

    // Usecase 2: サンキーデータ変換
    const convertToSankeyUsecase = new ConvertToSankeyUsecase();

    const transactionParams: GetTransactionsBySlugParams = {
      slug: resolvedParams.slug,
      perPage: 10000, // 大きな値を設定してすべてのトランザクションを取得
    };

    if (
      transactionType &&
      ["income", "expense", "other"].includes(transactionType)
    ) {
      transactionParams.transactionType = transactionType as
        | "income"
        | "expense"
        | "other";
    }
    if (dateFrom) {
      transactionParams.dateFrom = new Date(dateFrom);
    }
    if (dateTo) {
      transactionParams.dateTo = new Date(dateTo);
    }
    if (financialYear) {
      transactionParams.financialYear = parseInt(financialYear, 10);
    }

    // Usecase 1実行: トランザクションを取得
    const transactionResult = await getTransactionsUsecase.execute(transactionParams);
    
    // Usecase 2実行: サンキー図用データに変換
    const sankeyParams: ConvertToSankeyParams = {
      transactions: transactionResult.transactions,
    };
    const sankeyResult = await convertToSankeyUsecase.execute(sankeyParams);

    return NextResponse.json(sankeyResult.sankeyData);
  } catch (error) {
    console.error("Error fetching sankey data:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
