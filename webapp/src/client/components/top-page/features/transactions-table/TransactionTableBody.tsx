import type { DisplayTransaction } from "@/types/display-transaction";
import TransactionTableRow from "./TransactionTableRow";

interface TransactionTableBodyProps {
  transactions: (DisplayTransaction & {
    political_organization_name?: string;
  })[];
}

export default function TransactionTableBody({
  transactions,
}: TransactionTableBodyProps) {
  return (
    <tbody className="bg-white">
      {transactions.map((transaction) => (
        <TransactionTableRow key={transaction.id} transaction={transaction} />
      ))}
    </tbody>
  );
}
