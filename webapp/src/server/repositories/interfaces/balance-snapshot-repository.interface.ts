export interface BalanceSnapshotData {
  id: string;
  political_organization_id: string;
  snapshot_date: Date;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export interface IBalanceSnapshotRepository {
  getTotalLatestBalanceByOrgIds(orgIds: string[]): Promise<number>;
}
