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
  onApplyFilter?: (selectedKeys: string[]) => void;
  selectedCategories?: string[];
  onApplyPoliticalOrganizationFilter?: (selectedKeys: string[]) => void;
  selectedPoliticalOrganizations?: string[];
  availablePoliticalOrganizations?: { id: string; name: string }[];
}

export default function TransactionTable({
  transactions,
  allowControl = false,
  onSort,
  currentSort,
  currentOrder,
  onApplyFilter,
  selectedCategories,
  onApplyPoliticalOrganizationFilter,
  selectedPoliticalOrganizations,
  availablePoliticalOrganizations,
}: TransactionTableProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-visible">
        <table className="min-w-full bg-white" aria-label="政治資金取引一覧表">
          {/* Show header only on desktop */}
          <TransactionTableHeader
            allowControl={allowControl}
            onSort={onSort}
            currentSort={currentSort}
            currentOrder={currentOrder}
            onApplyFilter={onApplyFilter}
            selectedCategories={selectedCategories}
            onApplyPoliticalOrganizationFilter={
              onApplyPoliticalOrganizationFilter
            }
            selectedPoliticalOrganizations={selectedPoliticalOrganizations}
            availablePoliticalOrganizations={availablePoliticalOrganizations}
          />
          <TransactionTableBody transactions={transactions} />
        </table>
      </div>
    </div>
  );
}
