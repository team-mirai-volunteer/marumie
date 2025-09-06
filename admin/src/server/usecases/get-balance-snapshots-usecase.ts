import type {
  BalanceSnapshot,
  BalanceSnapshotFilters,
} from "@/shared/models/balance-snapshot";
import type { IBalanceSnapshotRepository } from "../repositories/interfaces/balance-snapshot-repository.interface";

export class GetBalanceSnapshotsUsecase {
  constructor(private repository: IBalanceSnapshotRepository) {}

  async execute(filters?: BalanceSnapshotFilters): Promise<BalanceSnapshot[]> {
    try {
      return await this.repository.findAll(filters);
    } catch (error) {
      throw new Error(
        `Failed to get balance snapshots: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
