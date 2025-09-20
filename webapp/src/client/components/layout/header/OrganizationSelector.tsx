"use client";
import "client-only";
import Selector from "@/client/components/ui/Selector";
import type { OrganizationsResponse } from "@/types/organization";

interface OrganizationSelectorProps {
  organizations: OrganizationsResponse;
}

export default function OrganizationSelector({
  organizations,
}: OrganizationSelectorProps) {
  const options = organizations.organizations.map((org) => ({
    value: org.slug,
    label: org.displayName,
    subtitle: org.orgName || undefined,
  }));

  const handleSelect = (value: string) => {
    // TODO: 選択された政治団体の処理を実装
    console.log("Selected organization:", value);
  };

  return (
    <Selector
      options={options}
      defaultValue={organizations.default}
      placeholder="チームみらい計"
      title="政治団体の区別"
      onSelect={handleSelect}
    />
  );
}
