import "server-only";

import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import type { PoliticalOrganization } from "@/shared/models/political-organization";

const prisma = new PrismaClient();
const CACHE_REVALIDATE_SECONDS = 60;

export const loadPoliticalOrganizationsData = unstable_cache(
  async (): Promise<PoliticalOrganization[]> => {
    try {
      const organizations = await prisma.politicalOrganization.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      const serializedOrganizations = organizations.map((org) => ({
        ...org,
        id: org.id.toString(),
      }));

      return serializedOrganizations;
    } catch (error) {
      console.error("Error fetching political organizations:", error);
      throw new Error("政治団体の取得に失敗しました");
    }
  },
  ["political-organizations-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
