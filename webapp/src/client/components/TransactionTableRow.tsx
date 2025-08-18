"use client";
import "client-only";

import type { Transaction } from "@/shared/models/transaction";

interface TransactionTableRowProps {
  transaction: Transaction;
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

  const getMainAccount = () => {
    let account, subAccount;

    if (transaction.transaction_type === "expense") {
      account = transaction.debit_account;
      subAccount = transaction.debit_sub_account;
    } else if (transaction.transaction_type === "income") {
      account = transaction.credit_account;
      subAccount = transaction.credit_sub_account;
    } else {
      account = transaction.debit_account;
      subAccount = transaction.debit_sub_account;
    }

    // アンダースコアで分割して最後のアイテムを取得
    const accountParts = account.split("_");
    const displayAccount = accountParts[accountParts.length - 1];

    return {
      account: displayAccount,
      subAccount: subAccount,
    };
  };

  const mainAccount = getMainAccount();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(transaction.transaction_date)}
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
        {transaction.transaction_type === "expense"
          ? formatCurrency(-transaction.debit_amount)
          : formatCurrency(transaction.debit_amount)}
      </td>
    </tr>
  );
}
