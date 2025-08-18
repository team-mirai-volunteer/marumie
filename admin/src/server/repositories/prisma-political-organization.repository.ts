import type { PrismaClient } from "@prisma/client";
import type { PoliticalOrganization } from "@/shared/model/political-organization";
import type { IPoliticalOrganizationRepository } from "./interfaces/political-organization-repository.interface";

export class PrismaPoliticalOrganizationRepository
  implements IPoliticalOrganizationRepository
{
  constructor(private prisma: PrismaClient) {}

  async create(
    name: string,
    description?: string,
  ): Promise<PoliticalOrganization> {
    const cleanName = name.trim();
    const cleanDescription = description?.trim() || undefined;

    const organization = await this.prisma.politicalOrganization.create({
      data: { name: cleanName, description: cleanDescription },
    });

    return {
      ...organization,
      id: organization.id.toString(),
    };
  }
}
