"use client";
import "client-only";

import { useState } from "react";
import type { PoliticalOrganization } from "@/shared/models/political-organization";
import { PoliticalOrganizationSelector } from "@/client/components/ui";
import BalanceSnapshotForm from "./BalanceSnapshotForm";

interface BalanceSnapshotsClientProps {
  organizations: PoliticalOrganization[];
}

export default function BalanceSnapshotsClient({
  organizations,
}: BalanceSnapshotsClientProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

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
        <div>
          <BalanceSnapshotForm
            politicalOrganizationId={selectedOrgId}
            onSubmit={handleFormSubmit}
          />
        </div>
      )}
    </div>
  );
}
