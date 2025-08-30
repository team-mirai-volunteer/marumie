"use client";
import "client-only";

import type { Transaction } from "@/shared/models/transaction";

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ja-JP");
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount);
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "income":
        return "収入";
      case "expense":
        return "支出";
      case "other":
        return "その他";
      default:
        return type;
    }
  };

  return (
    <tr className="border-b border-primary-border">
      <td className="px-2 py-3 text-sm text-white">
        {formatDate(transaction.transaction_date)}
      </td>
      <td className="px-2 py-3 text-sm text-white">
        <span
          className={`px-2 py-1 rounded text-white text-xs font-medium ${
            transaction.transaction_type === "income"
              ? "bg-green-600"
              : transaction.transaction_type === "expense"
                ? "bg-red-600"
                : "bg-gray-600"
          }`}
        >
          {getTransactionTypeLabel(transaction.transaction_type)}
        </span>
      </td>
      <td className="px-2 py-3 text-sm text-white">
        {transaction.debit_account}
        {transaction.debit_sub_account && (
          <div className="text-primary-muted text-xs">
            {transaction.debit_sub_account}
          </div>
        )}
      </td>
      <td className="px-2 py-3 text-sm text-right text-white">
        {formatAmount(transaction.debit_amount)}
      </td>
      <td className="px-2 py-3 text-sm text-white">
        {transaction.credit_account}
        {transaction.credit_sub_account && (
          <div className="text-primary-muted text-xs">
            {transaction.credit_sub_account}
          </div>
        )}
      </td>
      <td className="px-2 py-3 text-sm text-right text-white">
        {formatAmount(transaction.credit_amount)}
      </td>
      <td className="px-2 py-3 text-sm text-white">
        {transaction.description || "-"}
      </td>
    </tr>
  );
}
