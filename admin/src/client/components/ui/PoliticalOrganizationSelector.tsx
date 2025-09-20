"use client";
import "client-only";

import React, { useId, useEffect } from "react";
import type { PoliticalOrganization } from "@/shared/models/political-organization";

interface PoliticalOrganizationSelectorProps {
  organizations: PoliticalOrganization[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  autoSelectFirst?: boolean;
}

export default function PoliticalOrganizationSelector({
  organizations,
  value,
  onChange,
  label = "政治団体",
  autoSelectFirst = false,
}: PoliticalOrganizationSelectorProps) {
  const selectId = useId();

  useEffect(() => {
    if (autoSelectFirst && organizations.length > 0 && !value) {
      onChange(organizations[0].id);
    }
  }, [autoSelectFirst, organizations, value, onChange]);

  return (
    <div>
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-white mb-2"
      >
        {label}:
      </label>
      <select
        id={selectId}
        className="bg-primary-input text-white border border-primary-border rounded-lg px-3 py-2.5 w-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">-- 政治団体を選択してください --</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.displayName}
          </option>
        ))}
      </select>
      {organizations.length === 0 && (
        <p className="text-sm text-gray-400 mt-1">政治団体が見つかりません</p>
      )}
    </div>
  );
}
