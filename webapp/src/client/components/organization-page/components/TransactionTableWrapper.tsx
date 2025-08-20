"use client";
import "client-only";

import { useId, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(page);
  const [itemsPerPage, setItemsPerPage] = useState(perPage);
  const perPageId = useId();

  return (
    <>
      <TransactionTable
        transactions={transactions}
        total={total}
        page={currentPage}
        perPage={itemsPerPage}
        allowControl={allowControl}
      />

      {/* ページネーションコントロール */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-gray-600 text-sm">
          {total}件中 {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, total)}件を表示
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            前へ
          </button>
          <span className="text-sm text-gray-600">
            ページ {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            次へ
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={perPageId} className="text-sm text-gray-600">
            表示件数:
          </label>
          <select
            id={perPageId}
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 text-sm border rounded"
          >
            <option value={10}>10件</option>
            <option value={20}>20件</option>
            <option value={50}>50件</option>
            <option value={100}>100件</option>
          </select>
        </div>
      </div>
    </>
  );
}
