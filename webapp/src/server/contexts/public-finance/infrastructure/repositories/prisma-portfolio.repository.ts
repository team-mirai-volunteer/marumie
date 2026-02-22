import "server-only";

import type { PrismaClient, Prisma } from "@prisma/client";
import type { IPortfolioRepository } from "@/server/contexts/public-finance/domain/repositories/portfolio-repository.interface";
import type {
  PortfolioData,
  PortfolioAssetData,
} from "@/server/contexts/public-finance/domain/models/portfolio";

/**
 * Prisma を使用したポートフォリオリポジトリ実装
 *
 * 各組織の最新スナップショット日付のポートフォリオ資産を集計して返す。
 */
export class PrismaPortfolioRepository implements IPortfolioRepository {
  constructor(private prisma: PrismaClient) {}

  async getLatestPortfolio(organizationIds: string[]): Promise<PortfolioData> {
    if (organizationIds.length === 0) {
      return { assets: [], totalAmount: 0, snapshotDate: null };
    }

    const orgIdsBigInt = organizationIds.map((id) => BigInt(id));

    // 最新のスナップショット日付を取得
    const latestRecord = await this.prisma.portfolioAsset.findFirst({
      where: {
        politicalOrganizationId: { in: orgIdsBigInt },
      },
      orderBy: {
        snapshotDate: "desc",
      },
      select: {
        snapshotDate: true,
      },
    });

    if (!latestRecord) {
      return { assets: [], totalAmount: 0, snapshotDate: null };
    }

    const latestDate = latestRecord.snapshotDate;

    const assets = await this.prisma.portfolioAsset.findMany({
      where: {
        politicalOrganizationId: { in: orgIdsBigInt },
        snapshotDate: latestDate,
      },
      orderBy: {
        category: "asc",
      },
    });

    const snapshotDateStr = latestDate.toISOString().split("T")[0];

    const assetData: PortfolioAssetData[] = assets.map(
      (asset: Prisma.PortfolioAssetGetPayload<Record<string, never>>) => ({
        category: asset.category,
        label: asset.label,
        amount: Number(asset.amount),
        snapshotDate: snapshotDateStr,
      }),
    );

    const totalAmount = assetData.reduce((sum: number, a: PortfolioAssetData) => sum + a.amount, 0);

    return {
      assets: assetData,
      totalAmount,
      snapshotDate: snapshotDateStr,
    };
  }
}
