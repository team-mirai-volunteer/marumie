import { MfCsvLoader } from '../lib/mf-csv-loader';
import { MfRecordConverter } from '../lib/mf-record-converter';
import { EncodingConverter } from '../lib/encoding-converter';
import { ITransactionRepository } from '../repositories/interfaces/transaction-repository.interface';
import { CreateTransactionInput } from '@/shared/model/transaction';

export interface UploadMfCsvInput {
  csvContent: string | Buffer;
  politicalOrganizationId: string;
}

export interface UploadMfCsvResult {
  processedCount: number;
  savedCount: number;
  errors: string[];
}

export class UploadMfCsvUsecase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private csvLoader: MfCsvLoader = new MfCsvLoader(),
    private recordConverter: MfRecordConverter = new MfRecordConverter()
  ) {}

  async execute(input: UploadMfCsvInput): Promise<UploadMfCsvResult> {
    const result: UploadMfCsvResult = {
      processedCount: 0,
      savedCount: 0,
      errors: [],
    };

    try {
      // Convert buffer to string if needed
      const csvString = input.csvContent instanceof Buffer
        ? EncodingConverter.bufferToString(input.csvContent)
        : input.csvContent;

      const csvRecords = await this.csvLoader.load(csvString as string);
      result.processedCount = csvRecords.length;

      if (csvRecords.length === 0) {
        return result;
      }

      const convertedRecords = csvRecords.map(record =>
        this.recordConverter.convertRow(record)
      );

      const transactionInputs: CreateTransactionInput[] = convertedRecords.map(record => ({
        political_organization_id: input.politicalOrganizationId,
        transaction_no: record.transaction_no,
        transaction_date: new Date(record.transaction_date),
        financial_year: record.financial_year,
        transaction_type: record.mapped_transaction_type,
        debit_account: record.debit_account,
        debit_sub_account: record.debit_sub_account,
        debit_department: record.debit_department,
        debit_partner: record.debit_partner,
        debit_tax_category: record.debit_tax_category,
        debit_amount: record.debit_amount,
        credit_account: record.credit_account,
        credit_sub_account: record.credit_sub_account,
        credit_department: record.credit_department,
        credit_partner: record.credit_partner,
        credit_tax_category: record.credit_tax_category,
        credit_amount: record.credit_amount,
        description: record.description,
        description_1: record.tags,
        description_2: record.memo,
      }));

      const savedTransactions = await this.transactionRepository.createMany(transactionInputs);
      result.savedCount = savedTransactions.length;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      result.errors.push(errorMessage);
    }

    return result;
  }
}
