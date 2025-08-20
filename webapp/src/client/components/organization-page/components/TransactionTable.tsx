import type { DisplayTransaction } from "@/types/display-transaction";
import TransactionTableHeader from "./TransactionTableHeader";
import TransactionTableBody from "./TransactionTableBody";

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

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TransactionTableHeader allowControl={allowControl} />
            <TransactionTableBody transactions={transactions} />
          </table>
        </div>
      </div>
    </div>
  );
}
