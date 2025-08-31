import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";

export interface DeleteAllTransactionsResult {
  deletedCount: number;
}

export class DeleteAllTransactionsUsecase {
  constructor(private repository: ITransactionRepository) {}

  async execute(): Promise<DeleteAllTransactionsResult> {
    try {
      const deletedCount = await this.repository.deleteAll();

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
