"use client";
import "client-only";

import { useState } from "react";
import Image from "next/image";
import {
  ACCOUNT_CATEGORY_MAPPING,
  type CategoryMapping,
} from "@/shared/utils/category-mapping";

interface CategoryItem {
  id: string;
  label: string;
  checked: boolean;
}

const INCOME_CATEGORIES: CategoryItem[] = Object.entries(
  ACCOUNT_CATEGORY_MAPPING,
)
  .filter(([, mapping]: [string, CategoryMapping]) => mapping.type === "income")
  .map(([, mapping]: [string, CategoryMapping]) => ({
    id: mapping.key,
    label: mapping.shortLabel,
    checked: false,
  }));

const EXPENSE_CATEGORIES: CategoryItem[] = Object.entries(
  ACCOUNT_CATEGORY_MAPPING,
)
  .filter(
    ([, mapping]: [string, CategoryMapping]) => mapping.type === "expense",
  )
  .map(([, mapping]: [string, CategoryMapping]) => ({
    id: mapping.key,
    label: mapping.shortLabel,
    checked: false,
  }));

interface CategoryFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (selectedKeys: string[]) => void;
}

export default function CategoryFilter({
  isOpen,
  onClose,
  onApplyFilter,
}: CategoryFilterProps) {
  const [incomeCategories, setIncomeCategories] = useState(INCOME_CATEGORIES);
  const [expenseCategories, setExpenseCategories] =
    useState(EXPENSE_CATEGORIES);

  if (!isOpen) return null;

  const handleIncomeToggle = (id: string) => {
    setIncomeCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, checked: !cat.checked } : cat,
      ),
    );
  };

  const handleExpenseToggle = (id: string) => {
    setExpenseCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, checked: !cat.checked } : cat,
      ),
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    const selectedKeys = [
      ...incomeCategories.filter((cat) => cat.checked).map((cat) => cat.id),
      ...expenseCategories.filter((cat) => cat.checked).map((cat) => cat.id),
    ];
    onApplyFilter(selectedKeys);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-white rounded z-[9999] w-[236px] shadow-lg p-4">
      <div>
        <div className="flex flex-col items-center gap-6">
          {/* 収入カテゴリー */}
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-2 pt-2 pb-0">
              <span className="text-gray-600 text-xs font-medium leading-[1.67]">
                収入カテゴリー
              </span>
            </div>
            <div
              className="max-h-[172px] overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#9ca3af transparent",
              }}
            >
              {incomeCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleIncomeToggle(category.id)}
                  className="flex items-center gap-2 py-[6px] pl-2 pr-1 w-full h-auto hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                >
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    {category.checked && (
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
                      category.checked ? "font-bold" : "font-medium"
                    } text-[#47474C]`}
                  >
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 支出カテゴリー */}
          <div className="flex flex-col w-full">
            {/* 区切り線 */}
            <div className="flex flex-col justify-center gap-2 h-6">
              <div className="w-full h-0 border-t border-[#E5E7EB]"></div>
            </div>

            <div className="flex justify-stretch items-stretch">
              <span className="text-gray-600 text-xs font-medium leading-[1.67] tracking-[0.071em] flex-1">
                支出カテゴリー
              </span>
            </div>

            <div
              className="max-h-[172px] overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#9ca3af transparent",
              }}
            >
              {expenseCategories.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleExpenseToggle(category.id)}
                  className={`flex items-center gap-2 py-[6px] pl-2 pr-1 w-full transition-colors cursor-pointer ${
                    index === 7
                      ? "bg-[#F1F5F9] rounded-[6px]"
                      : "hover:bg-[#F1F5F9]"
                  }`}
                >
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    {category.checked && (
                      <div className="w-[18px] h-[18px] relative">
                        <Image
                          src="/icons/icon-check.svg"
                          alt="Checkbox background"
                          width={18}
                          height={18}
                          className="w-[18px] h-[18px]"
                        />
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
                      category.checked ? "font-bold" : "font-medium"
                    } text-[#47474C]`}
                  >
                    {category.label}
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
