import "server-only";
import { redirect } from "next/navigation";
import { loadValidOrgSlugs } from "@/server/loaders/load-valid-org-slugs";

export default async function NotFound() {
  const { default: defaultSlug } = await loadValidOrgSlugs();
  redirect(`/o/${defaultSlug}`);
}
