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
    validCount: number;
    invalidCount: number;
    skipCount: number;
  };
  statistics: {
    valid: {
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
            validCount: 0,
            invalidCount: 0,
            skipCount: 0,
          },
          statistics: this.createEmptyStatistics(),
        };
      }

      // Get existing transaction numbers first
      const transactionNos = csvRecords
        .map((record) => record.transaction_no)
        .filter(Boolean) as string[];

      const duplicateTransactionNos =
        await this.transactionRepository.checkDuplicateTransactionNos(
          input.politicalOrganizationId,
          transactionNos,
        );

      // Validate records including duplicate check
      const validationResult = this.validator.validateRecords(
        csvRecords,
        duplicateTransactionNos,
      );

      // Convert records to preview transactions
      const previewTransactions: PreviewTransaction[] = csvRecords.map(
        (record) =>
          this.recordConverter.convertRow(
            record,
            input.politicalOrganizationId,
          ),
      );

      // Apply validation results to transactions
      previewTransactions.forEach((transaction, index) => {
        const csvRecord = csvRecords[index];
        const validationError = validationResult.errors.find(
          (e) => e.record === csvRecord,
        );

        if (validationError) {
          if (validationError.isDuplicate) {
            transaction.status = "skip";
            transaction.skipReason = "重複データのためスキップされます";
          } else {
            transaction.status = "invalid";
          }
          transaction.errors = validationError.errors;
        }
      });

      const summary = {
        totalCount: previewTransactions.length,
        validCount: previewTransactions.filter((t) => t.status === "valid")
          .length,
        invalidCount: previewTransactions.filter((t) => t.status === "invalid")
          .length,
        skipCount: previewTransactions.filter((t) => t.status === "skip")
          .length,
      };

      const statistics = this.calculateStatistics(previewTransactions);

      return {
        transactions: previewTransactions,
        summary,
        statistics,
      };
    } catch (_error) {
      return {
        transactions: [],
        summary: {
          totalCount: 0,
          validCount: 0,
          invalidCount: 0,
          skipCount: 0,
        },
        statistics: this.createEmptyStatistics(),
      };
    }
  }

  private createEmptyStatistics() {
    return {
      valid: {
        income: { count: 0, amount: 0 },
        expense: { count: 0, amount: 0 },
        offset_income: { count: 0, amount: 0 },
        offset_expense: { count: 0, amount: 0 },
      },
      invalid: {
        income: { count: 0, amount: 0 },
        expense: { count: 0, amount: 0 },
        offset_income: { count: 0, amount: 0 },
        offset_expense: { count: 0, amount: 0 },
      },
      skip: {
        income: { count: 0, amount: 0 },
        expense: { count: 0, amount: 0 },
        offset_income: { count: 0, amount: 0 },
        offset_expense: { count: 0, amount: 0 },
      },
    };
  }

  private calculateStatistics(transactions: PreviewTransaction[]) {
    const statistics = this.createEmptyStatistics();

    for (const transaction of transactions) {
      const status = transaction.status;
      const transactionType = transaction.transaction_type;

      // statusが有効な値かチェック
      if (status !== "valid" && status !== "invalid" && status !== "skip") {
        continue;
      }

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
