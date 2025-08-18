import type { CreateTransactionInput } from "@/shared/model/transaction";
import { MfCsvLoader } from "../lib/mf-csv-loader";
import { MfRecordConverter } from "../lib/mf-record-converter";
import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";

export interface UploadMfCsvInput {
  csvContent: string;
  politicalOrganizationId: string;
}

export interface UploadMfCsvResult {
  processedCount: number;
  savedCount: number;
  skippedCount: number;
  errors: string[];
}

export class UploadMfCsvUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private csvLoader: MfCsvLoader = new MfCsvLoader(),
    private recordConverter: MfRecordConverter = new MfRecordConverter(),
  ) {}

  async execute(input: UploadMfCsvInput): Promise<UploadMfCsvResult> {
    const result: UploadMfCsvResult = {
      processedCount: 0,
      savedCount: 0,
      skippedCount: 0,
      errors: [],
    };

    try {
      const csvRecords = await this.csvLoader.load(input.csvContent);
      result.processedCount = csvRecords.length;

      if (csvRecords.length === 0) {
        return result;
      }

      const transactionInputs: CreateTransactionInput[] = csvRecords.map(
        (record) =>
          this.recordConverter.convertRow(
            record,
            input.politicalOrganizationId,
          ),
      );

      const createResult =
        await this.transactionRepository.createManySkipDuplicates(
          transactionInputs,
        );
      result.savedCount = createResult.created.length;
      result.skippedCount = createResult.skipped;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      result.errors.push(errorMessage);
    }

    return result;
  }
}
