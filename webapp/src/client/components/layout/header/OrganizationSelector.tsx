"use client";
import "client-only";
import { useRouter, usePathname } from "next/navigation";
import Selector from "@/client/components/ui/Selector";
import type { OrganizationsResponse } from "@/types/organization";

interface OrganizationSelectorProps {
  organizations: OrganizationsResponse;
  currentSlug: string;
}

export default function OrganizationSelector({
  organizations,
  currentSlug,
}: OrganizationSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const options = organizations.organizations.map((org) => ({
    value: org.slug,
    label: org.displayName,
    subtitle: org.orgName || undefined,
  }));

  const handleSelect = (value: string) => {
    const pathSegments = pathname.split("/");

    if (pathSegments[1] === "o" && pathSegments[2]) {
      pathSegments[2] = value;
      const newPath = pathSegments.join("/");
      router.push(newPath);
    }
  };

  return (
    <Selector
      options={options}
      defaultValue={currentSlug}
      placeholder="チームみらい計"
      title="政治団体の区別"
      onSelect={handleSelect}
    />
  );
}
