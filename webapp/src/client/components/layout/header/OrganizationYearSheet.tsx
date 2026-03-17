"use client";
import "client-only";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import type { OrganizationsResponse } from "@/types/organization";

const AVAILABLE_YEARS = [2025, 2026] as const;
const DEFAULT_YEAR = 2026;

interface OrganizationYearSheetProps {
  organizations: OrganizationsResponse;
  initialSlug?: string;
  initialYear?: number;
}

export default function OrganizationYearSheet({
  organizations,
  initialSlug,
  initialYear,
}: OrganizationYearSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlug, setCurrentSlug] = useState(initialSlug || "");
  const [currentYear, setCurrentYear] = useState(initialYear || DEFAULT_YEAR);

  useEffect(() => {
    const pathSegments = pathname.split("/");
    // URL format: /o/{slug}/{year}/...
    if (pathSegments[1] === "o" && pathSegments[2]) {
      setCurrentSlug(pathSegments[2]);
      if (pathSegments[3]) {
        const yearFromPath = parseInt(pathSegments[3], 10);
        if (AVAILABLE_YEARS.includes(yearFromPath as (typeof AVAILABLE_YEARS)[number])) {
          setCurrentYear(yearFromPath);
        }
      }
    }
  }, [pathname]);

  const currentOrganization = organizations.organizations.find((org) => org.slug === currentSlug);

  const handleSelect = (slug: string, year: number) => {
    const pathSegments = pathname.split("/");

    // Determine the rest of the path after slug/year (e.g., /transactions)
    let restOfPath = "";
    if (pathSegments[1] === "o" && pathSegments[2]) {
      // Check if there's content after the year
      if (pathSegments[4]) {
        restOfPath = `/${pathSegments.slice(4).join("/")}`;
      }
    }

    const newPath = `/o/${slug}/${year}${restOfPath}`;
    router.push(newPath);
  };

  const handleOrganizationSelect = (slug: string) => {
    handleSelect(slug, currentYear);
  };

  const handleYearSelect = (year: number) => {
    handleSelect(currentSlug, year);
  };

  return (
    <div className="relative w-full min-w-0 max-w-full">
      {/* Trigger Button */}
      <button
        type="button"
        className="flex items-center justify-between w-full min-w-0 px-2 py-2 lg:px-4 lg:py-2.5 border border-gray-600 rounded-md text-gray-800 text-sm lg:text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
        style={{
          background:
            "linear-gradient(90deg, rgba(226, 246, 243, 1) 0%, rgba(238, 246, 226, 1) 100%)",
        }}
        onClick={() => setIsOpen(true)}
      >
        <span className="text-left truncate flex-1 min-w-0">
          {currentOrganization?.displayName || "政治団体を選択"}
        </span>
        <Image
          src="/icons/icon-chevron-down.svg"
          alt=""
          width={20}
          height={20}
          className={isOpen ? "rotate-180" : ""}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="閉じる"
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 top-full mt-1 z-50 w-[304px] bg-white rounded-lg border border-black/50 shadow-lg py-3 max-h-[70vh] overflow-y-auto">
            {/* Organization Selection */}
            <div className="px-4 flex flex-col gap-1">
              <p className="text-[11px] text-gray-500">表示する団体名</p>
              <div className="flex flex-col">
                {organizations.organizations.map((org) => (
                  <button
                    key={org.slug}
                    type="button"
                    onClick={() => handleOrganizationSelect(org.slug)}
                    className="flex items-center gap-2 h-9 pl-6 text-left"
                  >
                    <span className="w-3 text-center text-[15px] text-[#238778]">
                      {currentSlug === org.slug ? "✓" : ""}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-xs text-gray-900">{org.displayName}</span>
                      {org.orgName && (
                        <span className="text-[8px] text-[#6a6a6a]">{org.orgName}</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <hr className="my-2 border-gray-200" />

            {/* Year Selection */}
            <div className="px-4 py-1 flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="text-[11px] text-gray-500">対象年</p>
              <div className="flex gap-3">
                {AVAILABLE_YEARS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={`px-3 py-1.5 rounded-full text-[11px] transition-colors ${
                      currentYear === year ? "font-bold text-[#238778]" : "bg-gray-200 text-black"
                    }`}
                    style={
                      currentYear === year
                        ? {
                            background:
                              "linear-gradient(157deg, rgb(226, 246, 243) 24%, rgb(238, 246, 226) 76%)",
                          }
                        : undefined
                    }
                  >
                    {year}年
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <hr className="my-2 border-gray-200" />

            {/* Close */}
            <div className="px-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-[#238778]"
              >
                閉じる
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
