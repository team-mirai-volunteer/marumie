"use client";
import "client-only";

import { useState } from "react";
import Image from "next/image";

interface PoliticalOrganizationFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (selectedKeys: string[]) => void;
  selectedPoliticalOrganizations?: string[];
  availablePoliticalOrganizations: { id: string; name: string }[];
}

export default function PoliticalOrganizationFilter({
  isOpen,
  onClose,
  onApplyFilter,
  selectedPoliticalOrganizations = [],
  availablePoliticalOrganizations,
}: PoliticalOrganizationFilterProps) {
  const [politicalOrgs, setPoliticalOrgs] = useState(() =>
    availablePoliticalOrganizations.map((org) => ({
      id: org.id,
      label: org.name,
      checked: selectedPoliticalOrganizations.includes(org.id),
    })),
  );

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setPoliticalOrgs((prev) =>
      prev.map((org) =>
        org.id === id ? { ...org, checked: !org.checked } : org,
      ),
    );
  };

  const handleSelectAll = () => {
    const allChecked = politicalOrgs.every((org) => org.checked);
    setPoliticalOrgs((prev) =>
      prev.map((org) => ({ ...org, checked: !allChecked })),
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    const selectedKeys = politicalOrgs
      .filter((org) => org.checked)
      .map((org) => org.id);

    onApplyFilter(selectedKeys);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-white rounded z-[9999] w-[236px] shadow-lg p-4">
      <div>
        <div className="flex flex-col items-center gap-6">
          {/* 政治組織 */}
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-2 pt-2 pb-0">
              <span className="text-gray-600 text-xs font-medium leading-[1.67]">
                政治組織
              </span>
            </div>
            <div
              className="max-h-[172px] overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#9ca3af transparent",
              }}
            >
              {/* すべて選択オプション */}
              <button
                type="button"
                onClick={handleSelectAll}
                className="flex items-center gap-2 py-[6px] pl-2 pr-1 w-full h-auto hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  {politicalOrgs.every((org) => org.checked) && (
                    <div className="w-[18px] h-[18px] relative">
                      <Image
                        src="/icons/icon-checkmark.svg"
                        alt="Checkmark"
                        width={13}
                        height={11}
                        className="absolute top-[4px] left-[2.5px]"
                      />
                    </div>
                  )}
                </div>
                <span
                  className={`text-[13px] leading-[1.54] text-left flex-1 ${
                    politicalOrgs.every((org) => org.checked)
                      ? "font-bold"
                      : "font-medium"
                  } text-[#47474C]`}
                >
                  （すべて選択）
                </span>
              </button>
              {politicalOrgs.map((org) => (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => handleToggle(org.id)}
                  className="flex items-center gap-2 py-[6px] pl-2 pr-1 w-full h-auto hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                >
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    {org.checked && (
                      <div className="w-[18px] h-[18px] relative">
                        <Image
                          src="/icons/icon-checkmark.svg"
                          alt="Checkmark"
                          width={13}
                          height={11}
                          className="absolute top-[4px] left-[2.5px]"
                        />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[13px] leading-[1.54] text-left flex-1 ${
                      org.checked ? "font-bold" : "font-medium"
                    } text-[#47474C]`}
                  >
                    {org.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex justify-center items-center gap-[10px] py-2 w-[88px] bg-[#F1F5F9] border-[0.5px] border-[#D1D5DB] rounded-[6px] hover:opacity-70 transition-opacity cursor-pointer"
            >
              <span className="text-[#238778] text-sm font-medium leading-[1.29]">
                キャンセル
              </span>
            </button>
            <button
              type="button"
              onClick={handleOk}
              className="flex justify-center items-center gap-[10px] py-2 w-[88px] bg-[#238778] rounded-[6px] hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span className="text-white text-sm font-medium leading-[1.29]">
                OK
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
