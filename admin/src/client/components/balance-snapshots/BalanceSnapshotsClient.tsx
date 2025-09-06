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

  const handleFormSubmit = (data: {
    politicalOrganizationId: string;
    snapshotDate: string;
    balance: number;
  }) => {
    console.log("Submit balance snapshot:", data);
    // TODO: Server actionを呼び出す
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
