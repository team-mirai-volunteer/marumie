import "server-only";

import type { IPortfolioRepository } from "@/server/contexts/public-finance/domain/repositories/portfolio-repository.interface";
import type { IPoliticalOrganizationRepository } from "@/server/contexts/public-finance/domain/repositories/political-organization-repository.interface";
import type { PortfolioData } from "@/server/contexts/public-finance/domain/models/portfolio";

export interface GetPortfolioResult {
  portfolioData: PortfolioData;
}

/**
 * ポートフォリオを取得するユースケース
 */
export class GetPortfolioUsecase {
  constructor(
    private portfolioRepository: IPortfolioRepository,
    private politicalOrganizationRepository: IPoliticalOrganizationRepository,
  ) {}

  async execute(slugs: string[]): Promise<GetPortfolioResult> {
    const organizations = await this.politicalOrganizationRepository.findBySlugs(slugs);

    if (organizations.length === 0) {
      return {
        portfolioData: { assets: [], totalAmount: 0, snapshotDate: null },
      };
    }

    const orgIds = organizations.map((org) => org.id);
    const portfolioData = await this.portfolioRepository.getLatestPortfolio(orgIds);

    return { portfolioData };
  }
}
