import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import { DeleteAllTransactionsUsecase } from "@/server/usecases/delete-all-transactions-usecase";
import {
  type GetTransactionsParams,
  GetTransactionsUsecase,
} from "@/server/usecases/get-transactions-usecase";

export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "50", 10);
    const politicalOrganizationId = searchParams.get("politicalOrganizationId");
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

    const repository = new PrismaTransactionRepository(prisma);
    const usecase = new GetTransactionsUsecase(repository);

    const params: GetTransactionsParams = { page, perPage };
    if (politicalOrganizationId) {
      params.politicalOrganizationId = politicalOrganizationId;
    }
    if (transactionType && ["income", "expense"].includes(transactionType)) {
      params.transactionType = transactionType as "income" | "expense";
    }
    if (dateFrom) {
      params.dateFrom = new Date(dateFrom);
    }
    if (dateTo) {
      params.dateTo = new Date(dateTo);
    }
    if (financialYear) {
      params.financialYear = parseInt(financialYear, 10);
    }

    const result = await usecase.execute(params);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request) {
  try {
    const repository = new PrismaTransactionRepository(prisma);
    const usecase = new DeleteAllTransactionsUsecase(repository);

    const result = await usecase.execute();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
