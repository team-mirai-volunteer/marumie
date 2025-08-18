"use client";
import "client-only";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { Transaction } from "@/shared/models/transaction";
import TransactionTableRow from "./TransactionTableRow";

interface TransactionTableProps {
  transactions: Transaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  slug: string;
}

export default function TransactionTable({
  transactions,
  total,
  page,
  perPage,
  totalPages,
  slug,
}: TransactionTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortField, setSortField] = useState<
    "date" | "account" | "amount" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    return `/${slug}/transactions?${params.toString()}`;
  };

  const handlePageChange = (newPage: number) => {
    const url = buildPageUrl(newPage);
    router.push(url);
  };

  const handleSort = (field: "date" | "account" | "amount") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getMainAccount = useCallback((transaction: Transaction) => {
    let account: string;
    if (transaction.transaction_type === "expense") {
      account = transaction.debit_account;
    } else if (transaction.transaction_type === "income") {
      account = transaction.credit_account;
    } else {
      account = transaction.debit_account;
    }
    const accountParts = account.split("_");
    return accountParts[accountParts.length - 1];
  }, []);

  const sortedTransactions = useMemo(() => {
    if (!sortField) return transactions;

    return [...transactions].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "date":
          aValue = new Date(a.transaction_date).getTime();
          bValue = new Date(b.transaction_date).getTime();
          break;
        case "account":
          aValue = getMainAccount(a);
          bValue = getMainAccount(b);
          break;
        case "amount":
          aValue =
            a.transaction_type === "expense" ? -a.debit_amount : a.debit_amount;
          bValue =
            b.transaction_type === "expense" ? -b.debit_amount : b.debit_amount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [transactions, sortField, sortDirection, getMainAccount]);

  const getSortIcon = (field: "date" | "account" | "amount") => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-gray-600 text-sm">
          {total}件中 {(page - 1) * perPage + 1}-
          {Math.min(page * perPage, total)}件を表示
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider hover:bg-gray-100"
                  onClick={() => handleSort("date")}
                >
                  取引日 {getSortIcon("date")}
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  収入項目
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider hover:bg-gray-100"
                  onClick={() => handleSort("account")}
                >
                  会計科目 {getSortIcon("account")}
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-right font-medium text-gray-500 text-xs uppercase tracking-wider hover:bg-gray-100"
                  onClick={() => handleSort("amount")}
                >
                  金額 {getSortIcon("amount")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedTransactions.map((transaction) => (
                <TransactionTableRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-gray-600 text-sm">
            ページ {page} / {totalPages}
          </div>
          <div className="flex space-x-2">
            {page > 1 && (
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              >
                前へ
              </button>
            )}
            {page < totalPages && (
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              >
                次へ
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
