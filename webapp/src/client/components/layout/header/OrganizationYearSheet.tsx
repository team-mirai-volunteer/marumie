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
    setIsOpen(false);
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

      {/* Sheet Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 bg-black/50 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="シートを閉じる"
          />

          {/* Sheet Content */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">表示する政治団体と年度</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="閉じる"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Year Selection */}
              <div>
                <h3 className="text-sm font-bold text-gray-600 mb-3">年度</h3>
                <div className="flex gap-2">
                  {AVAILABLE_YEARS.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                        currentYear === year
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {year}年度
                    </button>
                  ))}
                </div>
              </div>

              {/* Organization Selection */}
              <div>
                <h3 className="text-sm font-bold text-gray-600 mb-3">政治団体</h3>
                <div className="space-y-2">
                  {organizations.organizations.map((org) => (
                    <button
                      key={org.slug}
                      type="button"
                      onClick={() => handleOrganizationSelect(org.slug)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        currentSlug === org.slug
                          ? "bg-teal-50 border-2 border-teal-600"
                          : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-bold text-gray-800">{org.displayName}</div>
                      {org.orgName && (
                        <div className="text-xs text-gray-500 mt-0.5">{org.orgName}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
