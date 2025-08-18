import type { PrismaClient, PoliticalOrganization as PrismaPoliticalOrganization } from "@prisma/client";
import type { PoliticalOrganization } from "@/shared/models/political-organization";
import type { IPoliticalOrganizationRepository } from "./interfaces/political-organization-repository.interface";

export class PrismaPoliticalOrganizationRepository
  implements IPoliticalOrganizationRepository
{
  constructor(private prisma: PrismaClient) {}

  async findBySlug(slug: string): Promise<PoliticalOrganization | null> {
    const organization = await this.prisma.politicalOrganization.findUnique({
      where: { slug },
    });

    return organization ? this.mapToPoliticalOrganization(organization) : null;
  }

  async findById(id: string): Promise<PoliticalOrganization | null> {
    const organization = await this.prisma.politicalOrganization.findUnique({
      where: { id: BigInt(id) },
    });

    return organization ? this.mapToPoliticalOrganization(organization) : null;
  }

  async findAll(): Promise<PoliticalOrganization[]> {
    const organizations = await this.prisma.politicalOrganization.findMany({
      orderBy: { name: 'asc' },
    });

    return organizations.map(this.mapToPoliticalOrganization);
  }

  private mapToPoliticalOrganization(
    prismaOrganization: PrismaPoliticalOrganization,
  ): PoliticalOrganization {
    return {
      id: prismaOrganization.id.toString(),
      name: prismaOrganization.name,
      slug: prismaOrganization.slug,
      description: prismaOrganization.description,
      createdAt: prismaOrganization.createdAt,
      updatedAt: prismaOrganization.updatedAt,
    };
  }
}