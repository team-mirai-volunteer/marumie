import type { BalanceSheetData } from "@/types/balance-sheet";
import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";

export interface GetBalanceSheetParams {
  slugs: string[];
  financialYear: number;
}

export interface GetBalanceSheetResult {
  balanceSheetData: BalanceSheetData;
}

export class GetBalanceSheetUsecase {
  constructor(private _transactionRepository: ITransactionRepository) {}

  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params: GetBalanceSheetParams,
  ): Promise<GetBalanceSheetResult> {
    try {
      const balanceSheetData = await this.calculateBalanceSheet();

      return { balanceSheetData };
    } catch (error) {
      throw new Error(
        `Failed to get balance sheet data: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async calculateBalanceSheet(): Promise<BalanceSheetData> {
    // 現在はモックデータを返す
    // 実際の実装では、トランザクションデータから資産・負債を計算する必要がある
    const mockData: BalanceSheetData = {
      left: {
        currentAssets: 5123456,
        fixedAssets: 0,
        debtExcess: 14876544,
      },
      right: {
        currentLiabilities: 0,
        fixedLiabilities: 20000000,
        netAssets: 0,
      },
    };

    // TODO: 実際の計算ロジックを実装
    // 1. 資産科目（現金、普通預金、固定資産等）の残高を計算
    // 2. 負債科目（借入金、未払金等）の残高を計算
    // 3. 純資産（資本金、利益剰余金等）の残高を計算
    // 4. 債務超過の場合の処理

    return mockData;
  }
}
