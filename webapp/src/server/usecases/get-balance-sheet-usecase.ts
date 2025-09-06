import type { BalanceSheetData } from "@/types/balance-sheet";
import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";
import type { IBalanceSnapshotRepository } from "../repositories/interfaces/balance-snapshot-repository.interface";
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

    // 4. 固定負債を計算（借入金の収入 - 支出）
    const [borrowingIncome, borrowingExpense] = await Promise.all([
      this._transactionRepository.getBorrowingIncomeTotal(
        orgIds,
        params.financialYear,
      ),
      this._transactionRepository.getBorrowingExpenseTotal(
        orgIds,
        params.financialYear,
      ),
    ]);
    const fixedLiabilities = borrowingIncome - borrowingExpense;

    // TODO: 他の項目の実装
    // 5. 固定資産の計算
    // 6. 流動負債の計算
    // 7. 純資産の計算
    // 8. 債務超過の場合の処理

    const balanceSheetData: BalanceSheetData = {
      left: {
        currentAssets,
        fixedAssets: 0, // TODO: 実装
        debtExcess: 0, // TODO: 計算
      },
      right: {
        currentLiabilities: 0, // TODO: 実装
        fixedLiabilities,
        netAssets: 0, // TODO: 実装
      },
    };

    return balanceSheetData;
  }
}
