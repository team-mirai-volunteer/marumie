import type { Transaction } from "@/shared/models/transaction";

export interface TransactionWithOrganization extends Transaction {
  political_organization_name?: string;
}
