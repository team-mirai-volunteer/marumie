import type { PrismaClient } from "@prisma/client";
import type { PoliticalOrganization } from "@/shared/models/political-organization";
import type { IPoliticalOrganizationRepository } from "./interfaces/political-organization-repository.interface";

export class PrismaPoliticalOrganizationRepository
  implements IPoliticalOrganizationRepository
{
  constructor(private prisma: PrismaClient) {}

  async create(
    name: string,
    slug: string,
    description?: string,
  ): Promise<PoliticalOrganization> {
    const cleanName = name.trim();
    const cleanSlug = slug.trim();
    const cleanDescription = description?.trim() || undefined;

    const organization = await this.prisma.politicalOrganization.create({
      data: { name: cleanName, slug: cleanSlug, description: cleanDescription },
    });

    return {
      ...organization,
      id: organization.id.toString(),
    };
  }

  async delete(id: bigint): Promise<void> {
    await this.prisma.politicalOrganization.delete({
      where: { id },
    });
  }

  async countTransactions(id: bigint): Promise<number> {
    return await this.prisma.transaction.count({
      where: { politicalOrganizationId: id },
    });
  }
}
