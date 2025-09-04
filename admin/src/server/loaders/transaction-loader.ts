import "server-only";

import { PrismaClient } from "@prisma/client";
import { PrismaTransactionRepository } from "../repositories/prisma-transaction.repository";
import {
  GetTransactionsUsecase,
  type GetTransactionsParams,
  type GetTransactionsResult,
} from "../usecases/get-transactions-usecase";

const prisma = new PrismaClient();

export async function getTransactions(
  params: GetTransactionsParams = {},
): Promise<GetTransactionsResult> {
  const repository = new PrismaTransactionRepository(prisma);
  const usecase = new GetTransactionsUsecase(repository);

  return usecase.execute(params);
}
