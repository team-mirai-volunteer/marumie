import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/server/lib/prisma";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import {
  type GetTransactionsForCsvParams,
  GetTransactionsForCsvUsecase,
} from "@/server/usecases/get-transactions-for-csv-usecase";

const CACHE_REVALIDATE_SECONDS = 3600;

export const loadTransactionsForCsv = unstable_cache(
  async (params: GetTransactionsForCsvParams) => {
    const transactionRepository = new PrismaTransactionRepository(prisma);
    const politicalOrganizationRepository =
      new PrismaPoliticalOrganizationRepository(prisma);
    const usecase = new GetTransactionsForCsvUsecase(
      transactionRepository,
      politicalOrganizationRepository,
    );

    return await usecase.execute(params);
  },
  ["transactions-for-csv"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
