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
      <div className="flex items-center justify-between">
        <div className="text-gray-600 text-sm">
          {total}件中 {(page - 1) * perPage + 1}-
          {Math.min(page * perPage, total)}件を表示
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <TransactionTableHeader allowControl={allowControl} />
          <TransactionTableBody transactions={transactions} />
        </table>
      </div>
    </div>
  );
}
