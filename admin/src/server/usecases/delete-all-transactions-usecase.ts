import { TransactionFilters } from "@/shared/model/transaction";
import { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";

export interface DeleteAllTransactionsParams {
  politicalOrganizationId?: string;
  transactionType?: "income" | "expense" | "other";
  dateFrom?: Date;
  dateTo?: Date;
  financialYear?: number;
}

export interface DeleteAllTransactionsResult {
  deletedCount: number;
}

export class DeleteAllTransactionsUsecase {
  constructor(private repository: ITransactionRepository) {}

  async execute(
    params: DeleteAllTransactionsParams = {},
  ): Promise<DeleteAllTransactionsResult> {
    try {
      const filters: TransactionFilters = {};

      if (params.politicalOrganizationId) {
        filters.political_organization_id = params.politicalOrganizationId;
      }
      if (params.transactionType) {
        filters.transaction_type = params.transactionType;
      }
      if (params.dateFrom) {
        filters.date_from = params.dateFrom;
      }
      if (params.dateTo) {
        filters.date_to = params.dateTo;
      }
      if (params.financialYear) {
        filters.financial_year = params.financialYear;
      }

      const deletedCount = await this.repository.deleteAll(filters);

      return {
        deletedCount,
      };
    } catch (error) {
      throw new Error(
        `Failed to delete transactions: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
