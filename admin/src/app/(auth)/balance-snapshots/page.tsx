import "server-only";

import { loadPoliticalOrganizationsData } from "@/server/loaders/load-political-organizations-data";
import { loadBalanceSnapshotsData } from "@/server/loaders/load-balance-snapshots-data";
import BalanceSnapshotsClient from "@/client/components/balance-snapshots/BalanceSnapshotsClient";

export default async function BalanceSnapshotsPage() {
  const [organizations, snapshots] = await Promise.all([
    loadPoliticalOrganizationsData(),
    loadBalanceSnapshotsData(),
  ]);

  return (
    <div className="bg-primary-panel rounded-xl p-4">
      <h1 className="text-2xl font-bold text-white mb-6">残高登録</h1>
      <BalanceSnapshotsClient
        organizations={organizations}
        initialSnapshots={snapshots}
      />
    </div>
  );
}
