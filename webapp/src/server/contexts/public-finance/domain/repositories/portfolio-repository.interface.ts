import type { PortfolioData } from "@/server/contexts/public-finance/domain/models/portfolio";

export interface IPortfolioRepository {
  /**
   * 指定した組織IDリストの最新スナップショット日付のポートフォリオ資産を取得する
   */
  getLatestPortfolio(organizationIds: string[]): Promise<PortfolioData>;
}
