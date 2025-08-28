"use client";
import "client-only";

import { useState } from "react";
import Image from "next/image";

interface CategoryItem {
  id: string;
  label: string;
  checked: boolean;
}

const INCOME_CATEGORIES: CategoryItem[] = [
  { id: "party-fee", label: "党費・会費", checked: false },
  { id: "individual-donation", label: "個人寄付", checked: false },
  { id: "corporate-donation", label: "法人寄付", checked: true },
  { id: "political-donation", label: "政党寄付", checked: false },
  { id: "anonymous-donation", label: "政党匿名寄付", checked: false },
  { id: "magazine", label: "機関紙誌", checked: true },
  { id: "political-party", label: "政治資金パーティ", checked: false },
  { id: "other-business", label: "その他事業", checked: false },
  { id: "loan", label: "借入金", checked: false },
  { id: "subsidy", label: "交付金", checked: false },
  { id: "other-income", label: "その他", checked: false },
];

const EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: "personnel", label: "人件費", checked: false },
  { id: "utilities", label: "光熱水費", checked: false },
  { id: "supplies", label: "備品消耗品費", checked: true },
  { id: "office", label: "事務所費", checked: false },
  { id: "organization", label: "組織活動費", checked: true },
  { id: "election", label: "選挙関係費", checked: false },
  { id: "magazine-expense", label: "機関紙誌費", checked: false },
  { id: "promotion", label: "宣伝事業費", checked: false },
  { id: "party-expense", label: "政治資金パーティ費", checked: false },
  { id: "other-business-expense", label: "その他事業費", checked: false },
  { id: "research", label: "調査研究費", checked: false },
  { id: "donation-grant", label: "寄付・交付金", checked: false },
  { id: "other-expense", label: "その他経費", checked: false },
];

interface CategoryFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryFilter({
  isOpen,
  onClose,
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
    // TODO: Apply filter logic
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-white rounded z-[9999] w-[268px] shadow-lg">
      <div className="py-4">
        <div className="flex flex-col items-center gap-6">
          {/* 収入カテゴリー */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 px-3 pt-2 pb-0">
              <span className="text-[#9CA3AF] text-sm font-medium leading-[1.67]">
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
                  className="flex items-center gap-2 py-[6px] pl-4 pr-2 w-[236px] h-auto hover:bg-[#F1F5F9] transition-colors cursor-pointer"
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

          {/* 支出カテゴリー */}
          <div className="flex flex-col">
            {/* 区切り線 */}
            <div className="flex flex-col justify-center gap-2 px-3 h-6">
              <div className="w-full h-0 border-t border-[#E5E7EB]"></div>
            </div>

            <div className="flex justify-stretch items-stretch px-3">
              <span className="text-[#9CA3AF] text-sm font-medium leading-[1.67] tracking-[0.071em] flex-1">
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
                  className={`flex items-center gap-2 py-[6px] pl-4 pr-2 w-[236px] transition-colors cursor-pointer ${
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
