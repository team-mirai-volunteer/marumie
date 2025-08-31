"use client";
import "client-only";

import type { PreviewMfCsvResult } from "@/server/usecases/preview-mf-csv-usecase";

interface StatisticsTableProps {
  statistics: PreviewMfCsvResult["statistics"];
}

export default function StatisticsTable({ statistics }: StatisticsTableProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount);
  };

  const formatCell = (count: number, amount: number) => {
    if (count === 0) return "–";
    return `${formatAmount(amount)} (${count}件)`;
  };

  return (
    <div className="mb-4">
      <h4 className="text-md font-medium text-white mb-3">取引種別別統計</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-primary-border">
          <thead>
            <tr className="bg-primary-input">
              <th className="border border-primary-border px-3 py-2 text-left text-sm font-semibold text-white">
                状態
              </th>
              <th className="border border-primary-border px-3 py-2 text-center text-sm font-semibold text-white">
                収入
              </th>
              <th className="border border-primary-border px-3 py-2 text-center text-sm font-semibold text-white">
                支出
              </th>
              <th className="border border-primary-border px-3 py-2 text-center text-sm font-semibold text-white">
                収入（相殺）
              </th>
              <th className="border border-primary-border px-3 py-2 text-center text-sm font-semibold text-white">
                支出（相殺）
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-primary-border px-3 py-2 text-sm text-green-500 font-medium">
                有効
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.valid.income.count,
                  statistics.valid.income.amount,
                )}
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.valid.expense.count,
                  statistics.valid.expense.amount,
                )}
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.valid.offset_income.count,
                  statistics.valid.offset_income.amount,
                )}
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.valid.offset_expense.count,
                  statistics.valid.offset_expense.amount,
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-primary-border px-3 py-2 text-sm text-red-500 font-medium">
                無効
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.invalid.income.count,
                  statistics.invalid.income.amount,
                )}
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.invalid.expense.count,
                  statistics.invalid.expense.amount,
                )}
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.invalid.offset_income.count,
                  statistics.invalid.offset_income.amount,
                )}
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.invalid.offset_expense.count,
                  statistics.invalid.offset_expense.amount,
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-primary-border px-3 py-2 text-sm text-yellow-500 font-medium">
                スキップ
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.skip.income.count,
                  statistics.skip.income.amount,
                )}
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.skip.expense.count,
                  statistics.skip.expense.amount,
                )}
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.skip.offset_income.count,
                  statistics.skip.offset_income.amount,
                )}
              </td>
              <td className="border border-primary-border px-3 py-2 text-sm text-white text-center">
                {formatCell(
                  statistics.skip.offset_expense.count,
                  statistics.skip.offset_expense.amount,
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
