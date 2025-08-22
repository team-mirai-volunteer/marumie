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
        <div className="min-w-full bg-white">
          {/* Show header only on desktop */}
          <div className="hidden sm:block">
            <TransactionTableHeader
              allowControl={allowControl}
              onSort={onSort}
              currentSort={currentSort}
              currentOrder={currentOrder}
            />
          </div>
          <TransactionTableBody transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
