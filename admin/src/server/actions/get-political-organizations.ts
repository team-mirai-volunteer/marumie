import "server-only";

import { PrismaClient } from "@prisma/client";
import type { PoliticalOrganization } from "@/shared/models/political-organization";

const prisma = new PrismaClient();

export async function getPoliticalOrganizations(): Promise<
  PoliticalOrganization[]
> {
  try {
    const organizations = await prisma.politicalOrganization.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert BigInt to string for JSON serialization
    const serializedOrganizations = organizations.map((org) => ({
      ...org,
      id: org.id.toString(),
    }));

    return serializedOrganizations;
  } catch (error) {
    console.error("Error fetching political organizations:", error);
    throw new Error("政治団体の取得に失敗しました");
  }
}
