import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/server/lib/prisma";
import { PrismaTransactionRepository } from "../repositories/prisma-transaction.repository";
import {
  GetTransactionsUsecase,
  type GetTransactionsParams,
  type GetTransactionsResult,
} from "../usecases/get-transactions-usecase";
const CACHE_REVALIDATE_SECONDS = 5;

export const loadTransactionsData = unstable_cache(
  async (
    params: GetTransactionsParams = {},
  ): Promise<GetTransactionsResult> => {
    const repository = new PrismaTransactionRepository(prisma);
    const usecase = new GetTransactionsUsecase(repository);

    return usecase.execute(params);
  },
  ["transactions-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
