import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import {
  type GetTransactionsBySlugParams,
  GetTransactionsBySlugUsecase,
} from "@/server/usecases/get-transactions-by-slug-usecase";

const prisma = new PrismaClient();
const CACHE_REVALIDATE_SECONDS = 60;

export const loadTransactionsPageData = unstable_cache(
  async (params: GetTransactionsBySlugParams) => {
    const transactionRepository = new PrismaTransactionRepository(prisma);
    const politicalOrganizationRepository =
      new PrismaPoliticalOrganizationRepository(prisma);
    const usecase = new GetTransactionsBySlugUsecase(
      transactionRepository,
      politicalOrganizationRepository,
    );

    return await usecase.execute(params);
  },
  ["transactions-page-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
