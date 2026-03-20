import { BulkDeleteTransactionsClient } from "@/client/components/transactions/BulkDeleteTransactionsClient";
import { loadPoliticalOrganizationsData } from "@/server/contexts/shared/presentation/loaders/load-political-organizations-data";

export default async function BulkDeleteTransactionsPage() {
  const organizations = await loadPoliticalOrganizationsData();

  return <BulkDeleteTransactionsClient organizations={organizations} />;
}
