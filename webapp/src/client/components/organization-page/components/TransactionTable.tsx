import type { DisplayTransaction } from "@/types/display-transaction";
import TransactionTableBody from "./TransactionTableBody";
import TransactionTableHeader from "./TransactionTableHeader";

interface TransactionTableProps {
  transactions: DisplayTransaction[];
  total: number;
  page: number;
  perPage: number;
  allowControl?: boolean;
}

export default function TransactionTable({
  transactions,
  total,
  page,
  perPage,
  allowControl = false,
}: TransactionTableProps) {
  return (
    <div className="space-y-6">

      <div className="overflow-x-auto">
        <div className="min-w-full bg-white">
          <TransactionTableHeader allowControl={allowControl} />
          <TransactionTableBody transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
