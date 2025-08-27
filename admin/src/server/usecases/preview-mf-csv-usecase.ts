import type { CreateTransactionInput } from "@/shared/models/transaction";
import { MfCsvLoader } from "../lib/mf-csv-loader";
import { MfRecordConverter } from "../lib/mf-record-converter";
import { TransactionValidator } from "../lib/transaction-validator";
import type { ITransactionRepository } from "../repositories/interfaces/transaction-repository.interface";

export interface PreviewMfCsvInput {
  csvContent: string;
  politicalOrganizationId: string;
}

export interface PreviewTransaction {
  political_organization_id: string;
  transaction_no: string;
  transaction_date: Date;
  debit_account: string;
  debit_sub_account: string | undefined;
  debit_amount: number;
  credit_account: string;
  credit_sub_account: string | undefined;
  credit_amount: number;
  description: string | undefined;
  status: 'valid' | 'invalid' | 'skip';
  errors: string[];
  skipReason?: string;
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
      
      const transactionInputs: CreateTransactionInput[] = csvRecords.map(
        (record) =>
          this.recordConverter.convertRow(
            record,
            input.politicalOrganizationId,
          ),
      );

      const transactionNos = transactionInputs.map(t => t.transaction_no).filter(Boolean) as string[];
      const existingTransactions = await this.transactionRepository.findByTransactionNos(transactionNos);
      const existingTransactionNosSet = new Set(existingTransactions.map(t => t.transaction_no));

      const previewTransactions: PreviewTransaction[] = transactionInputs.map((transaction, index) => {
        const csvRecord = csvRecords[index];
        const validationError = validationResult.errors.find(e => e.record === csvRecord);
        
        let status: 'valid' | 'invalid' | 'skip';
        let errors: string[] = [];
        let skipReason: string | undefined;

        if (validationError) {
          status = 'invalid';
          errors = validationError.errors;
        } else if (existingTransactionNosSet.has(transaction.transaction_no || '')) {
          status = 'skip';
          skipReason = '重複データのためスキップされます';
        } else {
          status = 'valid';
        }

        return {
          political_organization_id: input.politicalOrganizationId,
          transaction_no: transaction.transaction_no || '',
          transaction_date: transaction.transaction_date,
          debit_account: transaction.debit_account,
          debit_sub_account: transaction.debit_sub_account,
          debit_amount: transaction.debit_amount,
          credit_account: transaction.credit_account,
          credit_sub_account: transaction.credit_sub_account,
          credit_amount: transaction.credit_amount,
          description: transaction.description,
          status,
          errors,
          skipReason,
        };
      });

      const summary = {
        totalCount: previewTransactions.length,
        validCount: previewTransactions.filter(t => t.status === 'valid').length,
        invalidCount: previewTransactions.filter(t => t.status === 'invalid').length,
        skipCount: previewTransactions.filter(t => t.status === 'skip').length,
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