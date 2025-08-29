"use client";
import "client-only";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type { DisplayTransaction } from "@/types/display-transaction";
import TransactionTable from "./TransactionTable";
import TransactionTableMobileHeader, {
  type SortOption,
} from "./TransactionTableMobileHeader";

interface SortConfig {
  sort: "date" | "amount";
  order: "asc" | "desc";
  filterType?: "income" | "expense";
}

const SORT_CONFIGS: Record<SortOption, SortConfig> = {
  "date-desc": { sort: "date", order: "desc" },
  "date-asc": { sort: "date", order: "asc" },
  "amount-desc": { sort: "amount", order: "desc" },
  "amount-asc": { sort: "amount", order: "asc" },
  "income-desc": { sort: "amount", order: "desc", filterType: "income" },
  "expense-desc": { sort: "amount", order: "desc", filterType: "expense" },
};

interface InteractiveTransactionTableProps {
  transactions: DisplayTransaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  selectedCategories?: string[];
}

export default function InteractiveTransactionTable({
  transactions,
  total,
  page,
  perPage,
  totalPages,
  selectedCategories,
}: InteractiveTransactionTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSort = (field: "date" | "amount") => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSort = params.get("sort");
    const currentOrder = params.get("order");

    // Toggle order if sorting the same field, otherwise default to desc
    if (currentSort === field) {
      params.set("order", currentOrder === "desc" ? "asc" : "desc");
    } else {
      params.set("sort", field);
      params.set("order", "desc");
    }

    // Reset to page 1 when sorting changes
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleMobileSortChange = (sortOption: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    const config = SORT_CONFIGS[sortOption];

    params.set("sort", config.sort);
    params.set("order", config.order);

    if (config.filterType) {
      params.set("filterType", config.filterType);
    } else {
      params.delete("filterType");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleApplyFilter = (selectedKeys: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedKeys.length > 0) {
      params.set("categories", selectedKeys.join(","));
    } else {
      params.delete("categories");
    }

    // Reset to page 1 when filtering changes
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const getCurrentSortOption = (): SortOption => {
    const sort = (searchParams.get("sort") as "date" | "amount") || "date";
    const order = (searchParams.get("order") as "asc" | "desc") || "desc";
    const filterType = searchParams.get("filterType") as
      | "income"
      | "expense"
      | null;

    // Find matching sort option from configuration
    for (const [sortOption, config] of Object.entries(SORT_CONFIGS)) {
      if (
        config.sort === sort &&
        config.order === order &&
        config.filterType === filterType
      ) {
        return sortOption as SortOption;
      }
    }

    // Fallback to basic sort-order pattern
    return `${sort}-${order}` as SortOption;
  };

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  return (
    <>
      {/* Mobile Header - 768px未満で表示 */}
      <div className="block md:hidden">
        <TransactionTableMobileHeader
          onSortChange={handleMobileSortChange}
          currentSort={getCurrentSortOption()}
        />
      </div>

      <TransactionTable
        transactions={transactions}
        allowControl={true}
        onSort={handleSort}
        currentSort={searchParams.get("sort") as "date" | "amount" | null}
        currentOrder={searchParams.get("order") as "asc" | "desc" | null}
        onApplyFilter={handleApplyFilter}
        selectedCategories={selectedCategories}
      />

      {/* Figmaデザインに基づくページネーション */}
      <div className="flex items-center justify-between py-3.5">
        <div className="text-sm font-medium text-[#6A7383] leading-5 tracking-[0.5%]">
          {total}件中 {startItem}-{endItem}件を表示
        </div>

        <div className="flex items-center gap-2 px-0.5">
          <button
            type="button"
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex items-center justify-center w-8 h-8 border border-[rgba(60,66,87,0.12)] rounded shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] bg-white hover:bg-gray-50 disabled:bg-[#F4F4F5] disabled:cursor-not-allowed transition-colors"
            aria-label="前のページ"
          >
            <Image
              src="/icons/icon-chevron-down.svg"
              alt="前のページ"
              width={20}
              height={20}
              className={`transform rotate-90 ${page === 1 ? "opacity-30" : "opacity-100"}`}
            />
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="flex items-center justify-center w-8 h-8 border border-[rgba(60,66,87,0.12)] rounded shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] bg-white hover:bg-gray-50 disabled:bg-[#F4F4F5] disabled:cursor-not-allowed transition-colors"
            aria-label="次のページ"
          >
            <Image
              src="/icons/icon-chevron-down.svg"
              alt="次のページ"
              width={20}
              height={20}
              className={`transform -rotate-90 ${page === totalPages ? "opacity-30" : "opacity-100"}`}
            />
          </button>
        </div>
      </div>
    </>
  );
}
