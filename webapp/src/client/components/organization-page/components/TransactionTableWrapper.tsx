"use client";
import "client-only";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type { DisplayTransaction } from "@/types/display-transaction";
import TransactionTable from "./TransactionTable";

interface TransactionTableWrapperProps {
  transactions: DisplayTransaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  allowControl?: boolean;
}

export default function TransactionTableWrapper({
  transactions,
  total,
  page,
  perPage,
  totalPages,
  allowControl = true,
}: TransactionTableWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  return (
    <>
      <TransactionTable
        transactions={transactions}
        total={total}
        page={page}
        perPage={perPage}
        allowControl={allowControl}
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
              src="/icons/icon_chevron-down.svg"
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
              src="/icons/icon_chevron-down.svg"
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
