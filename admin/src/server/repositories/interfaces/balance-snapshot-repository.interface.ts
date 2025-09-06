import type {
  BalanceSnapshot,
  CreateBalanceSnapshotInput,
} from "@/shared/models/balance-snapshot";

export interface IBalanceSnapshotRepository {
  create(input: CreateBalanceSnapshotInput): Promise<BalanceSnapshot>;
}
