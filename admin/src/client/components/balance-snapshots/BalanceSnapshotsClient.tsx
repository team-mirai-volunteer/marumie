"use client";
import "client-only";

import { useState } from "react";
import type { PoliticalOrganization } from "@/shared/models/political-organization";
import type { BalanceSnapshot } from "@/shared/models/balance-snapshot";
import { PoliticalOrganizationSelector } from "@/client/components/ui";
import BalanceSnapshotForm from "./BalanceSnapshotForm";
import BalanceSnapshotList from "./BalanceSnapshotList";

interface BalanceSnapshotsClientProps {
  organizations: PoliticalOrganization[];
  initialSnapshots: BalanceSnapshot[];
}

export default function BalanceSnapshotsClient({
  organizations,
  initialSnapshots,
}: BalanceSnapshotsClientProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  const filteredSnapshots = selectedOrgId
    ? initialSnapshots.filter(
        (snapshot) => snapshot.political_organization_id === selectedOrgId,
      )
    : [];

  const handleFormSubmit = async (data: {
    politicalOrganizationId: string;
    snapshotDate: string;
    balance: number;
  }) => {
    try {
      const { createBalanceSnapshot } = await import(
        "@/server/actions/create-balance-snapshot"
      );

      await createBalanceSnapshot(data);

      // TODO: 成功メッセージを表示
      console.log("Balance snapshot created successfully");

      // TODO: データを再取得してリストを更新
      window.location.reload();
    } catch (error) {
      // TODO: エラーメッセージを表示
      console.error("Failed to create balance snapshot:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <PoliticalOrganizationSelector
          organizations={organizations}
          value={selectedOrgId}
          onChange={setSelectedOrgId}
          autoSelectFirst={true}
        />
      </div>

      {selectedOrgId && (
        <div className="space-y-6">
          <BalanceSnapshotForm
            politicalOrganizationId={selectedOrgId}
            onSubmit={handleFormSubmit}
          />

          <div>
            <h3 className="text-lg font-medium mb-4">
              残高スナップショット一覧
            </h3>
            <BalanceSnapshotList snapshots={filteredSnapshots} />
          </div>
        </div>
      )}
    </div>
  );
}
