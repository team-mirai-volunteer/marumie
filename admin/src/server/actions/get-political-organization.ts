"use server";

import { PrismaClient } from "@prisma/client";
import type { PoliticalOrganization } from "@/shared/models/political-organization";

const prisma = new PrismaClient();

export async function getPoliticalOrganization(
  id: string,
): Promise<PoliticalOrganization> {
  try {
    const organizationId = parseInt(id, 10);

    if (Number.isNaN(organizationId)) {
      throw new Error("Invalid organization ID");
    }

    const organization = await prisma.politicalOrganization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new Error("政治団体が見つかりません");
    }

    // Convert BigInt to string for JSON serialization
    return {
      ...organization,
      id: organization.id.toString(),
    };
  } catch (error) {
    console.error("Error fetching political organization:", error);
    throw new Error(
      error instanceof Error ? error.message : "政治団体の取得に失敗しました",
    );
  }
}
