import type { TransactionType } from "@/shared/models/transaction";

export interface TransactionFilters {
  political_organization_ids?: string[];
  transaction_type?: TransactionType;
  debit_account?: string;
  credit_account?: string;
  date_from?: Date;
  date_to?: Date;
  financial_year?: number;
  category_keys?: string[];
}
