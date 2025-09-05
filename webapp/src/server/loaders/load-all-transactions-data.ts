import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import {
  type GetAllTransactionsBySlugParams,
  GetAllTransactionsBySlugUsecase,
} from "@/server/usecases/get-all-transactions-by-slug-usecase";

const prisma = new PrismaClient();
const CACHE_REVALIDATE_SECONDS = 60;

export const loadAllTransactionsData = unstable_cache(
  async (params: GetAllTransactionsBySlugParams) => {
    const transactionRepository = new PrismaTransactionRepository(prisma);
    const politicalOrganizationRepository =
      new PrismaPoliticalOrganizationRepository(prisma);
    const usecase = new GetAllTransactionsBySlugUsecase(
      transactionRepository,
      politicalOrganizationRepository,
    );

    return await usecase.execute(params);
  },
  ["all-transactions-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
