import "server-only";
import { redirect } from "next/navigation";
import { loadOrganizations } from "@/server/loaders/load-organizations";

export default async function NotFound() {
  const { default: defaultSlug } = await loadOrganizations();
  redirect(`/o/${defaultSlug}`);
}
