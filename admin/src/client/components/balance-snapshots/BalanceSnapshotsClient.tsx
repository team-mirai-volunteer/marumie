"use client";
import "client-only";

import { useState } from "react";
import type { PoliticalOrganization } from "@/shared/models/political-organization";
import { PoliticalOrganizationSelector } from "@/client/components/ui";

interface BalanceSnapshotsClientProps {
  organizations: PoliticalOrganization[];
}

export default function BalanceSnapshotsClient({
  organizations,
}: BalanceSnapshotsClientProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  return (
    <div className="space-y-3">
      <div>
        <PoliticalOrganizationSelector
          organizations={organizations}
          value={selectedOrgId}
          onChange={setSelectedOrgId}
          autoSelectFirst={true}
        />
      </div>

      {selectedOrgId && (
        <div className="text-sm text-gray-400">
          選択された政治団体ID: {selectedOrgId}
        </div>
      )}

      <div className="text-gray-400">残高登録機能を実装予定です。</div>
    </div>
  );
}
