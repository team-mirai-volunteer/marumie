"use client";
import "client-only";

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "amount-desc"
  | "amount-asc";

interface TransactionTableMobileHeaderProps {
  onSortChange: (sortOption: SortOption) => void;
  currentSort: SortOption;
}

interface TabItem {
  id: SortOption;
  label: string;
}

const TAB_ITEMS: TabItem[] = [
  { id: "date-desc", label: "新しい順" },
  { id: "date-asc", label: "古い順" },
  { id: "amount-desc", label: "価格が高い順" },
  { id: "amount-asc", label: "価格が安い順" },
];

export default function TransactionTableMobileHeader({
  onSortChange,
  currentSort,
}: TransactionTableMobileHeaderProps) {
  const handleClick = (sortOption: SortOption) => {
    console.log("Tab clicked:", sortOption); // デバッグ用
    onSortChange(sortOption);
  };

  return (
    <div className="w-full bg-white relative border-b-0">
      {/* Tab Items */}
      <div className="flex gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {TAB_ITEMS.map((tab) => {
          const isActive = currentSort === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleClick(tab.id)}
              className="flex flex-col items-center justify-center relative whitespace-nowrap py-2 px-2 cursor-pointer touch-manipulation"
            >
              {/* Tab Label */}
              <span
                className={`text-sm font-bold leading-[1.2857142857142858em] pointer-events-none ${
                  isActive ? "text-[#2AA693]" : "text-[#9CA3AF]"
                }`}
              >
                {tab.label}
              </span>

              {/* Active underline */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2AA693] pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom border line */}
      <div className="w-full h-[1px] bg-[#E5E7EB]" />
    </div>
  );
}
