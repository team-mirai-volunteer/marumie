import "server-only";
import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

export const loadValidOrgSlugs = unstable_cache(
  async (): Promise<{
    default: string;
    validSlugs: string[];
  }> => {
    // 全ての有効なslugを取得
    const allOrgs = await prisma.politicalOrganization.findMany({
      select: { slug: true },
      orderBy: { id: "asc" },
    });

    if (allOrgs.length === 0) {
      throw new Error("No political organizations found");
    }

    return {
      default: allOrgs[0].slug,
      validSlugs: allOrgs.map((org) => org.slug),
    };
  },
  ["valid-org-slugs"],
  {
    revalidate: 60, // 60秒間キャッシュ
  },
);
