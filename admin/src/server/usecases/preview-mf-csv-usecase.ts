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

export interface PreviewMfCsvResult {
  transactions: PreviewTransaction[];
  summary: {
    totalCount: number;
    validCount: number;
    invalidCount: number;
    skipCount: number;
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
        };
      }

      const validationResult = this.validator.validateRecords(csvRecords);

      const previewTransactions: PreviewTransaction[] = csvRecords.map(
        (record) =>
          this.recordConverter.convertRow(
            record,
            input.politicalOrganizationId,
          ),
      );

      const transactionNos = previewTransactions
        .map((t) => t.transaction_no)
        .filter(Boolean) as string[];

      const existingTransactions =
        await this.transactionRepository.findByTransactionNos(transactionNos);

      const existingTransactionNosSet = new Set(
        existingTransactions.map((t) => t.transaction_no),
      );

      // Apply validation and duplicate check
      previewTransactions.forEach((transaction, index) => {
        const csvRecord = csvRecords[index];
        const validationError = validationResult.errors.find(
          (e) => e.record === csvRecord,
        );

        if (validationError) {
          transaction.status = "invalid";
          transaction.errors = validationError.errors;
        } else if (existingTransactionNosSet.has(transaction.transaction_no)) {
          transaction.status = "skip";
          transaction.skipReason = "重複データのためスキップされます";
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

      return {
        transactions: previewTransactions,
        summary,
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
      };
    }
  }
}
