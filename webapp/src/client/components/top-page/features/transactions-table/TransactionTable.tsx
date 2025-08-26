import type { DisplayTransaction } from "@/types/display-transaction";
import TransactionTableBody from "./TransactionTableBody";
import TransactionTableHeader from "./TransactionTableHeader";

interface TransactionTableProps {
  transactions: DisplayTransaction[];
  allowControl?: boolean;
  onSort?: (field: "date" | "amount") => void;
  currentSort?: "date" | "amount" | null;
  currentOrder?: "asc" | "desc" | null;
  total?: number;
  page?: number;
  perPage?: number;
}

export default function TransactionTable({
  transactions,
  allowControl = false,
  onSort,
  currentSort,
  currentOrder,
}: TransactionTableProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white" aria-label="政治資金取引一覧表">
          {/* Show header only on desktop */}
          <TransactionTableHeader
            allowControl={allowControl}
            onSort={onSort}
            currentSort={currentSort}
            currentOrder={currentOrder}
          />
          <TransactionTableBody transactions={transactions} />
        </table>
      </div>
    </div>
  );
}
