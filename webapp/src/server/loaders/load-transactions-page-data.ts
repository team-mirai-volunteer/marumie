import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/server/lib/prisma";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import {
  type GetTransactionsBySlugParams,
  GetTransactionsBySlugUsecase,
} from "@/server/usecases/get-transactions-by-slug-usecase";
const CACHE_REVALIDATE_SECONDS = 3600;

export const loadTransactionsPageData = (
  params: GetTransactionsBySlugParams,
) => {
  const cacheKey = ["transactions-page-data", JSON.stringify(params)];

  return unstable_cache(
    async () => {
      const transactionRepository = new PrismaTransactionRepository(prisma);
      const politicalOrganizationRepository =
        new PrismaPoliticalOrganizationRepository(prisma);
      const usecase = new GetTransactionsBySlugUsecase(
        transactionRepository,
        politicalOrganizationRepository,
      );

      return await usecase.execute(params);
    },
    cacheKey,
    { revalidate: CACHE_REVALIDATE_SECONDS },
  )();
};
