export interface PortfolioAssetData {
  category: string;
  label: string;
  amount: number;
  snapshotDate: string;
}

export interface PortfolioData {
  assets: PortfolioAssetData[];
  totalAmount: number;
  snapshotDate: string | null;
}
