"use client";
import "client-only";
import { useState } from "react";
import type { OrganizationsResponse } from "@/types/organization";

interface OrganizationSelectorProps {
  organizations: OrganizationsResponse;
}

export default function OrganizationSelector({
  organizations,
}: OrganizationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(organizations.default);

  const selectedOrg = organizations.organizations.find(
    (org) => org.slug === selectedSlug,
  );

  return (
    <div className="relative flex-1 lg:flex-none lg:w-[217px]">
      {/* Closed State Button */}
      <button
        className="flex items-center justify-between w-full px-2 py-1 lg:px-4 lg:py-2.5 bg-white border border-gray-600 rounded-md text-gray-600 text-xs lg:text-sm font-bold hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-left truncate">
          {selectedOrg?.displayName || "チームみらい計"}
        </span>
        <svg
          width="10"
          height="7"
          viewBox="0 0 10 7"
          fill="none"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[217px] w-full bg-white border border-gray-600 rounded-md shadow-lg z-50">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600">
                政治団体の区別
              </span>
              <svg
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
                className="text-gray-600"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Organization List */}
            <div className="space-y-2.5">
              {organizations.organizations.map((org) => (
                <div key={org.slug} className="flex items-center gap-2">
                  {/* Checkbox */}
                  <div className="flex items-center justify-center w-[18px] h-[18px] bg-white rounded border">
                    {selectedSlug === org.slug && (
                      <svg
                        width="13"
                        height="10"
                        viewBox="0 0 13 10"
                        fill="none"
                        className="text-black"
                      >
                        <path
                          d="M1 5L4.5 8.5L12 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Organization Info */}
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-600">
                      {org.displayName}
                    </div>
                    {org.orgName && (
                      <div className="text-xs text-gray-600 leading-tight">
                        {org.orgName}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
