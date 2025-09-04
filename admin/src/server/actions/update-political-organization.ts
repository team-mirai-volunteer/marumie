"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export interface UpdatePoliticalOrganizationData {
  name: string;
  slug: string;
  description?: string;
}

export async function updatePoliticalOrganization(
  id: string,
  data: UpdatePoliticalOrganizationData,
) {
  try {
    const organizationId = parseInt(id, 10);

    if (Number.isNaN(organizationId)) {
      throw new Error("Invalid organization ID");
    }

    const { name, slug, description } = data;

    if (!name.trim()) {
      throw new Error("政治団体名は必須です");
    }

    if (!slug.trim()) {
      throw new Error("スラッグは必須です");
    }

    await prisma.politicalOrganization.update({
      where: { id: organizationId },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
      },
    });
  } catch (error) {
    console.error("Error updating political organization:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      throw new Error("政治団体が見つかりません");
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("このスラッグは既に使用されています");
    }

    throw new Error(
      error instanceof Error ? error.message : "政治団体の更新に失敗しました",
    );
  }

  revalidatePath("/political-organizations");
  redirect("/political-organizations");
}
