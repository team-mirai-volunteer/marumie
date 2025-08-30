"use client";
import "client-only";

import type { PreviewTransaction } from "@/server/usecases/preview-mf-csv-usecase";

interface TransactionRowProps {
  record: PreviewTransaction;
  index: number;
  currentPage: number;
  perPage: number;
}

function getStatusBgClass(status: PreviewTransaction["status"]) {
  switch (status) {
    case "valid":
      return "bg-green-600";
    case "invalid":
      return "bg-red-600";
    case "skip":
      return "bg-yellow-600";
    default:
      return "bg-gray-600";
  }
}

function getStatusText(status: PreviewTransaction["status"]) {
  switch (status) {
    case "valid":
      return "有効";
    case "invalid":
      return "無効";
    case "skip":
      return "スキップ";
    default:
      return "不明";
  }
}

export default function TransactionRow({
  record,
  index,
  currentPage,
  perPage,
}: TransactionRowProps) {
  return (
    <tr
      key={`${(currentPage - 1) * perPage + index}-${record.transaction_date}-${record.debit_account}-${record.credit_account}-${record.debit_amount || 0}`}
      className="border-b border-primary-border"
    >
      <td className="px-2 py-3 text-sm">
        <span
          className={`px-2 py-1 rounded text-white text-xs font-semibold ${getStatusBgClass(record.status)}`}
        >
          {getStatusText(record.status)}
        </span>
        {record.errors.length > 0 && (
          <div className="text-xs text-red-500 mt-1">
            {record.errors.join(", ")}
          </div>
        )}
        {record.skipReason && (
          <div className="text-xs text-yellow-500 mt-1">
            {record.skipReason}
          </div>
        )}
      </td>
      <td className="px-2 py-3 text-sm text-white">
        {new Date(record.transaction_date).toLocaleDateString("ja-JP")}
      </td>
      <td className="px-2 py-3 text-sm text-white">
        {record.debit_account}
        {record.debit_sub_account && (
          <div className="text-primary-muted text-xs">
            {record.debit_sub_account}
          </div>
        )}
      </td>
      <td className="px-2 py-3 text-sm text-right text-white">
        {record.debit_amount ? `¥${record.debit_amount.toLocaleString()}` : "-"}
      </td>
      <td className="px-2 py-3 text-sm text-white">
        {record.credit_account}
        {record.credit_sub_account && (
          <div className="text-primary-muted text-xs">
            {record.credit_sub_account}
          </div>
        )}
      </td>
      <td className="px-2 py-3 text-sm text-right text-white">
        {record.credit_amount
          ? `¥${record.credit_amount.toLocaleString()}`
          : "-"}
      </td>
      <td className="px-2 py-3 text-sm text-white">
        {record.description || "-"}
      </td>
    </tr>
  );
}
