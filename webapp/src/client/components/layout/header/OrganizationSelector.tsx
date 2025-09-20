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
          className={isOpen ? "rotate-180" : ""}
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
        <div className="absolute top-0 left-0 min-w-[217px] w-full bg-white border border-gray-600 rounded-md shadow-lg z-50">
          <div className="space-y-4">
            {/* Header */}
            <div
              className="flex items-center justify-between w-full px-2 py-1 lg:px-4 lg:py-2.5 cursor-pointer hover:bg-gray-50 rounded text-gray-600 text-xs lg:text-sm font-bold"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-left truncate">政治団体の区別</span>
              <svg
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
                className="transition-transform rotate-180"
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
            <div className="px-2 lg:px-4 pb-2 lg:pb-2.5 space-y-2.5">
              {organizations.organizations.map((org) => (
                <div key={org.slug} className="flex items-start gap-2">
                  {/* Checkbox */}
                  <div className="flex items-center justify-center w-[18px] h-[18px] mt-0.5">
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
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-600 leading-5">
                      {org.displayName}
                    </div>
                    {org.orgName && (
                      <div className="text-xs text-gray-600 leading-tight mt-1">
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
