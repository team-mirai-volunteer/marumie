"use client";
import "client-only";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Selector from "@/client/components/ui/Selector";
import type { OrganizationsResponse } from "@/types/organization";

interface OrganizationSelectorProps {
  organizations: OrganizationsResponse;
  initialSlug?: string;
}

export default function OrganizationSelector({
  organizations,
  initialSlug,
}: OrganizationSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentSlug, setCurrentSlug] = useState(initialSlug || "");

  useEffect(() => {
    const pathSegments = pathname.split("/");
    if (pathSegments[1] === "o" && pathSegments[2]) {
      setCurrentSlug(pathSegments[2]);
    }
  }, [pathname]);

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
      value={currentSlug}
      placeholder="チームみらい計"
      title="表示する政治団体"
      onSelect={handleSelect}
    />
  );
}
