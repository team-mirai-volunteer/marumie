"use server";

import { PrismaClient } from "@prisma/client";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import type { PoliticalOrganization } from "@/shared/models/political-organization";

const prisma = new PrismaClient();

export async function getAllPoliticalOrganizations(): Promise<
  PoliticalOrganization[]
> {
  const repository = new PrismaPoliticalOrganizationRepository(prisma);
  return await repository.findAll();
}
