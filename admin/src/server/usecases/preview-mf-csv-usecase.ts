import { MfCsvLoader } from "../lib/mf-csv-loader";
import {
  MfRecordConverter,
  type PreviewTransaction,
} from "../lib/mf-record-converter";
import { TransactionValidator } from "../lib/transaction-validator";
import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";

export interface PreviewMfCsvInput {
  csvContent: string;
  politicalOrganizationId: string;
}

export interface TransactionTypeStats {
  count: number;
  amount: number;
}

export interface PreviewMfCsvResult {
  transactions: PreviewTransaction[];
  summary: {
    totalCount: number;
    insertCount: number;
    updateCount: number;
    invalidCount: number;
    skipCount: number;
  };
  statistics: {
    insert: {
      income: TransactionTypeStats;
      expense: TransactionTypeStats;
      offset_income: TransactionTypeStats;
      offset_expense: TransactionTypeStats;
    };
    update: {
      income: TransactionTypeStats;
      expense: TransactionTypeStats;
      offset_income: TransactionTypeStats;
      offset_expense: TransactionTypeStats;
    };
    invalid: {
      income: TransactionTypeStats;
      expense: TransactionTypeStats;
      offset_income: TransactionTypeStats;
      offset_expense: TransactionTypeStats;
    };
    skip: {
      income: TransactionTypeStats;
      expense: TransactionTypeStats;
      offset_income: TransactionTypeStats;
      offset_expense: TransactionTypeStats;
    };
  };
}

export class PreviewMfCsvUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private csvLoader: MfCsvLoader = new MfCsvLoader(),
    private recordConverter: MfRecordConverter = new MfRecordConverter(),
    private validator: TransactionValidator = new TransactionValidator(),
  ) {}

  async execute(input: PreviewMfCsvInput): Promise<PreviewMfCsvResult> {
    try {
      const csvRecords = await this.csvLoader.load(input.csvContent);

      if (csvRecords.length === 0) {
        return {
          transactions: [],
          summary: {
            totalCount: 0,
            insertCount: 0,
            updateCount: 0,
            invalidCount: 0,
            skipCount: 0,
          },
          statistics: this.createEmptyStatistics(),
        };
      }

      // Get existing transactions first
      const transactionNos = csvRecords
        .map((record) => record.transaction_no)
        .filter(Boolean) as string[];

      const existingTransactions =
        await this.transactionRepository.findByTransactionNos(transactionNos, [
          input.politicalOrganizationId,
        ]);

      // Convert records to preview transactions
      const convertedTransactions: PreviewTransaction[] = csvRecords.map(
        (record) =>
          this.recordConverter.convertRow(
            record,
            input.politicalOrganizationId,
          ),
      );

      // Validate converted transactions including duplicate check
      const previews = this.validator.validatePreviewTransactions(
        convertedTransactions,
        existingTransactions,
      );

      const summary = {
        totalCount: previews.length,
        insertCount: previews.filter((t) => t.status === "insert").length,
        updateCount: previews.filter((t) => t.status === "update").length,
        invalidCount: previews.filter((t) => t.status === "invalid").length,
        skipCount: previews.filter((t) => t.status === "skip").length,
      };

      const statistics = this.calculateStatistics(previews);

      return {
        transactions: previews,
        summary,
        statistics,
      };
    } catch (_error) {
      return {
        transactions: [],
        summary: {
          totalCount: 0,
          insertCount: 0,
          updateCount: 0,
          invalidCount: 0,
          skipCount: 0,
        },
        statistics: this.createEmptyStatistics(),
      };
    }
  }

  private createEmptyStatistics() {
    return {
      insert: {
        income: { count: 0, amount: 0 },
        expense: { count: 0, amount: 0 },
        offset_income: { count: 0, amount: 0 },
        offset_expense: { count: 0, amount: 0 },
        current_liabilities: { count: 0, amount: 0 },
      },
      update: {
        income: { count: 0, amount: 0 },
        expense: { count: 0, amount: 0 },
        offset_income: { count: 0, amount: 0 },
        offset_expense: { count: 0, amount: 0 },
        current_liabilities: { count: 0, amount: 0 },
      },
      invalid: {
        income: { count: 0, amount: 0 },
        expense: { count: 0, amount: 0 },
        offset_income: { count: 0, amount: 0 },
        offset_expense: { count: 0, amount: 0 },
        current_liabilities: { count: 0, amount: 0 },
      },
      skip: {
        income: { count: 0, amount: 0 },
        expense: { count: 0, amount: 0 },
        offset_income: { count: 0, amount: 0 },
        offset_expense: { count: 0, amount: 0 },
        current_liabilities: { count: 0, amount: 0 },
      },
    };
  }

  private calculateStatistics(transactions: PreviewTransaction[]) {
    const statistics = this.createEmptyStatistics();

    for (const transaction of transactions) {
      const status = transaction.status;
      const transactionType = transaction.transaction_type;

      // transactionTypeがnullの場合はスキップ
      if (transactionType === null) {
        continue;
      }

      // 統計を更新
      statistics[status][transactionType].count += 1;

      // 収入系は credit_amount、支出系は debit_amount を使用
      const amount =
        transactionType === "income" || transactionType === "offset_income"
          ? transaction.credit_amount
          : transaction.debit_amount;
      statistics[status][transactionType].amount += amount;
    }

    return statistics;
  }
}
