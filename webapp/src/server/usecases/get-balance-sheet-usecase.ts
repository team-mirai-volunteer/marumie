import type { BalanceSheetData } from "@/types/balance-sheet";
import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";
import type { IBalanceSnapshotRepository } from "../repositories/prisma-balance-snapshot.repository";
import type { IPoliticalOrganizationRepository } from "../repositories/interfaces/political-organization-repository.interface";

export interface GetBalanceSheetParams {
  slugs: string[];
  financialYear: number;
}

export interface GetBalanceSheetResult {
  balanceSheetData: BalanceSheetData;
}

export class GetBalanceSheetUsecase {
  constructor(
    private _transactionRepository: ITransactionRepository,
    private _balanceSnapshotRepository: IBalanceSnapshotRepository,
    private _politicalOrganizationRepository: IPoliticalOrganizationRepository,
  ) {}

  async execute(params: GetBalanceSheetParams): Promise<GetBalanceSheetResult> {
    try {
      const balanceSheetData = await this.calculateBalanceSheet(params);

      return { balanceSheetData };
    } catch (error) {
      throw new Error(
        `Failed to get balance sheet data: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async calculateBalanceSheet(
    params: GetBalanceSheetParams,
  ): Promise<BalanceSheetData> {
    // 1. slugから政治団体のIDを取得
    const organizations =
      await this._politicalOrganizationRepository.findBySlugs(params.slugs);
    const orgIds = organizations.map((org) => org.id);

    // 2. 各組織の最新残高スナップショットを取得
    const balanceSnapshots =
      await this._balanceSnapshotRepository.findLatestByOrgIds(orgIds);

    // 3. 流動資産を計算（現在は残高の合計）
    const currentAssets = balanceSnapshots.reduce((total, snapshot) => {
      return total + snapshot.balance;
    }, 0);

    // TODO: 他の項目の実装
    // 4. 固定資産の計算
    // 5. 負債項目の計算
    // 6. 純資産の計算
    // 7. 債務超過の場合の処理

    const balanceSheetData: BalanceSheetData = {
      left: {
        currentAssets,
        fixedAssets: 0, // TODO: 実装
        debtExcess: 0, // TODO: 計算
      },
      right: {
        currentLiabilities: 0, // TODO: 実装
        fixedLiabilities: 0, // TODO: 実装
        netAssets: 0, // TODO: 実装
      },
    };

    return balanceSheetData;
  }
}
