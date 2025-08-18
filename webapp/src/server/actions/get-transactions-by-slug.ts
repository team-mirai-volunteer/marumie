"use server";

import { PrismaClient } from "@prisma/client";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import {
  type GetTransactionsBySlugParams,
  GetTransactionsBySlugUsecase,
} from "@/server/usecases/get-transactions-by-slug-usecase";

const prisma = new PrismaClient();

export async function getTransactionsBySlugAction(
  params: GetTransactionsBySlugParams,
) {
  const transactionRepository = new PrismaTransactionRepository(prisma);
  const politicalOrganizationRepository =
    new PrismaPoliticalOrganizationRepository(prisma);
  const usecase = new GetTransactionsBySlugUsecase(
    transactionRepository,
    politicalOrganizationRepository,
  );

  return await usecase.execute(params);
}
