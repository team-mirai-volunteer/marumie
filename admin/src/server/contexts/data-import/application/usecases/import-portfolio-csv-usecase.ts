import "server-only";

import type { PrismaClient } from "@prisma/client";
import type { PortfolioCsvLoader } from "@/server/contexts/data-import/infrastructure/portfolio-csv/portfolio-csv-loader";

export interface ImportPortfolioCsvInput {
  csvContent: string;
  politicalOrganizationId: string;
}

export interface ImportPortfolioCsvOutput {
  importedCount: number;
}

const VALID_CATEGORIES = ["cash", "stocks", "precious_metals", "real_estate", "other"];

export class ImportPortfolioCsvUsecase {
  constructor(
    private readonly csvLoader: PortfolioCsvLoader,
    private readonly prisma: PrismaClient,
  ) {}

  async execute(input: ImportPortfolioCsvInput): Promise<ImportPortfolioCsvOutput> {
    const { csvContent, politicalOrganizationId } = input;

    const records = this.csvLoader.load(csvContent);

    if (records.length === 0) {
      throw new Error("CSVにインポート可能な行がありません");
    }

    // バリデーション
    for (const record of records) {
      if (!VALID_CATEGORIES.includes(record.category)) {
        throw new Error(
          `不正なカテゴリです: "${record.category}". 有効なカテゴリ: ${VALID_CATEGORIES.join(", ")}`,
        );
      }
      const amount = Number(record.amount);
      if (Number.isNaN(amount) || amount < 0) {
        throw new Error(`不正な金額です: "${record.amount}"`);
      }
      if (!record.snapshotDate || !/^\d{4}-\d{2}-\d{2}$/.test(record.snapshotDate)) {
        throw new Error(
          `不正な日付形式です: "${record.snapshotDate}". YYYY-MM-DD形式で指定してください`,
        );
      }
      if (!record.label) {
        throw new Error("ラベルは必須です");
      }
    }

    const orgId = BigInt(politicalOrganizationId);

    // 同日付のデータを削除して上書き
    const snapshotDates = [...new Set(records.map((r) => r.snapshotDate))];
    for (const date of snapshotDates) {
      await this.prisma.portfolioAsset.deleteMany({
        where: {
          politicalOrganizationId: orgId,
          snapshotDate: new Date(date),
        },
      });
    }

    await this.prisma.portfolioAsset.createMany({
      data: records.map((record) => ({
        politicalOrganizationId: orgId,
        snapshotDate: new Date(record.snapshotDate),
        category: record.category,
        label: record.label,
        amount: BigInt(Math.round(Number(record.amount))),
      })),
    });

    return { importedCount: records.length };
  }
}
