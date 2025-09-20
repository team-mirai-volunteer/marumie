import "server-only";
import { loadOrganizations } from "@/server/loaders/load-organizations";
import HeaderClient from "@/client/components/layout/header/HeaderClient";

export default async function Header() {
  const organizationsData = await loadOrganizations();

  return <HeaderClient organizations={organizationsData} />;
}
