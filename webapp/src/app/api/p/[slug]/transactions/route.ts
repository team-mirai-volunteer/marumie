import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import {
  type GetTransactionsBySlugParams,
  GetTransactionsBySlugUsecase,
} from "@/server/usecases/get-transactions-by-slug-usecase";

export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "50", 10);
    const transactionType = searchParams.get("transactionType");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const financialYear = searchParams.get("financialYear");

    if (page < 1 || perPage < 1 || perPage > 100) {
      return NextResponse.json(
        { error: "Invalid page or perPage parameters" },
        { status: 400 },
      );
    }

    const transactionRepository = new PrismaTransactionRepository(prisma);
    const politicalOrganizationRepository =
      new PrismaPoliticalOrganizationRepository(prisma);
    const usecase = new GetTransactionsBySlugUsecase(
      transactionRepository,
      politicalOrganizationRepository,
    );

    const usecaseParams: GetTransactionsBySlugParams = {
      slug: resolvedParams.slug,
      page,
      perPage,
    };

    if (
      transactionType &&
      ["income", "expense", "other"].includes(transactionType)
    ) {
      usecaseParams.transactionType = transactionType as
        | "income"
        | "expense"
        | "other";
    }
    if (dateFrom) {
      usecaseParams.dateFrom = new Date(dateFrom);
    }
    if (dateTo) {
      usecaseParams.dateTo = new Date(dateTo);
    }
    if (financialYear) {
      usecaseParams.financialYear = parseInt(financialYear, 10);
    }

    const result = await usecase.execute(usecaseParams);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching transactions by slug:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
