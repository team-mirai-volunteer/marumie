import "server-only";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loadValidOrgSlug(
  slug: string | null | undefined,
): Promise<string> {
  // 有効なslugの場合はそのまま返す
  if (slug) {
    const existingOrg = await prisma.politicalOrganization.findUnique({
      where: { slug },
      select: { slug: true },
    });
    if (existingOrg) {
      return slug;
    }
  }

  // 無効なslugまたは存在しないslugの場合、最もIDが若い組織のslugを返す
  const firstOrg = await prisma.politicalOrganization.findFirst({
    orderBy: { id: "asc" },
    select: { slug: true },
  });

  if (!firstOrg) {
    throw new Error("No political organizations found");
  }

  return firstOrg.slug;
}
