"use client";
import "client-only";

import type { DisplayTransaction } from "@/types/display-transaction";

interface TransactionTableRowProps {
  transaction: DisplayTransaction;
}

export default function TransactionTableRow({
  transaction,
}: TransactionTableRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount);
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}.${month}.${day}`;
  };

  const mainAccount = {
    account: transaction.category,
    subAccount: transaction.subcategory,
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(transaction.date)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {transaction.tags || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div>{mainAccount.account}</div>
        {mainAccount.subAccount && (
          <div className="text-xs text-gray-500">{mainAccount.subAccount}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
        {formatCurrency(transaction.amount)}
      </td>
    </tr>
  );
}
