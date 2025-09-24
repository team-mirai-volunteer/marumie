"use client";
import "client-only";

import type { PreviewTransaction } from "@/server/lib/mf-record-converter";
import { TOTAL_CATEGORY_MAP } from "@/shared/utils/category-mapping";

interface TransactionRowProps {
  record: PreviewTransaction;
  index: number;
  currentPage: number;
  perPage: number;
}

const DEFAULT_CATEGORY_COLOR = "#64748B"; // slate-500 as default fallback color

function getCategoryInfoByAccount(accountName: string) {
  return TOTAL_CATEGORY_MAP[accountName];
}

function getCategoryColor(accountName: string): string {
  const categoryInfo = getCategoryInfoByAccount(accountName);
  return categoryInfo?.color || DEFAULT_CATEGORY_COLOR;
}

function getCategoryLabel(accountName: string): string {
  const categoryInfo = getCategoryInfoByAccount(accountName);
  return categoryInfo?.shortLabel || accountName;
}

function getTransactionCategory(record: PreviewTransaction) {
  // 借方（debit）が費用系の場合は借方のカテゴリを、そうでなければ貸方のカテゴリを表示
  const debitInfo = getCategoryInfoByAccount(record.debit_account);
  const creditInfo = getCategoryInfoByAccount(record.credit_account);

  if (debitInfo?.type === "expense") {
    return {
      account: record.debit_account,
      color: getCategoryColor(record.debit_account),
      label: getCategoryLabel(record.debit_account),
      type: debitInfo.type,
    };
  } else {
    return {
      account: record.credit_account,
      color: getCategoryColor(record.credit_account),
      label: getCategoryLabel(record.credit_account),
      type: creditInfo?.type || "unknown",
    };
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "income":
      return "収入";
    case "expense":
      return "支出";
    case "offset_income":
      return "相殺収入";
    case "offset_expense":
      return "相殺支出";
    case "invalid":
      return "無効";
    default:
      return "不明";
  }
}

function getTypeBadgeClass(type: string): string {
  switch (type) {
    case "income":
    case "offset_income":
      return "bg-green-600";
    case "expense":
    case "offset_expense":
      return "bg-red-600";
    case "invalid":
      return "bg-orange-600";
    default:
      return "bg-gray-600";
  }
}

function getStatusBgClass(status: PreviewTransaction["status"]) {
  switch (status) {
    case "insert":
      return "bg-green-600";
    case "update":
      return "bg-blue-600";
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
    case "insert":
      return "挿入";
    case "update":
      return "更新";
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
          <div
            className={`text-xs mt-1 ${
              record.status === "skip" ? "text-yellow-500" : "text-red-500"
            }`}
          >
            {record.errors.map((error, errorIndex) => (
              <div key={`error-${errorIndex}-${error}`}>{error}</div>
            ))}
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
        {(() => {
          const category = getTransactionCategory(record);
          return (
            <span
              className={`px-2 py-1 rounded text-white text-xs font-medium ${getTypeBadgeClass(category.type)}`}
            >
              {getTypeLabel(category.type)}
            </span>
          );
        })()}
      </td>
      <td className="px-2 py-3 text-sm text-white">
        {(() => {
          const category = getTransactionCategory(record);
          return (
            <div
              className={`inline-block px-2 py-1 rounded text-xs font-medium max-w-fit ${
                category.type === "income" ? "text-black" : "text-white"
              }`}
              style={{ backgroundColor: category.color }}
            >
              {category.label}
            </div>
          );
        })()}
      </td>
      <td className="px-2 py-3 text-sm text-white">
        {record.description || "-"}
        {record.label && (
          <div className="text-blue-400 text-xs mt-1">
            ラベル: {record.label}
          </div>
        )}
      </td>
    </tr>
  );
}
