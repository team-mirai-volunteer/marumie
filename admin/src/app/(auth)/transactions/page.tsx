import { TransactionsClient } from "@/client/components/transactions/TransactionsClient";
import { loadPoliticalOrganizationsData } from "@/server/loaders/load-political-organizations-data";

export default async function TransactionsPage() {
  const organizations = await loadPoliticalOrganizationsData();

  return <TransactionsClient organizations={organizations} />;
}
