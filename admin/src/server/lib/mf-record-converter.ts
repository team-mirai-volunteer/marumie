import { MfCsvRecord } from './mf-csv-loader';
import { TransactionType } from '@/shared/model/transaction';

export interface ConvertedMfRecord {
  transaction_no: string;
  transaction_date: string;
  financial_year: number;
  transaction_type: '収入' | '支出' | 'それ以外';
  mapped_transaction_type: TransactionType;
  debit_account: string;
  debit_sub_account: string;
  debit_department: string;
  debit_partner: string;
  debit_tax_category: string;
  debit_invoice: string;
  debit_amount: number;
  credit_account: string;
  credit_sub_account: string;
  credit_department: string;
  credit_partner: string;
  credit_tax_category: string;
  credit_invoice: string;
  credit_amount: number;
  description: string;
  tags: string;
  memo: string;
}

export class MfRecordConverter {
  constructor() {}

  public convertRow(record: MfCsvRecord): ConvertedMfRecord {
    const debitAmount = this.parseAmount(record.debit_amount);
    const creditAmount = this.parseAmount(record.credit_amount);
    const transactionType = this.determineTransactionType(
      record.debit_account,
      record.credit_account
    );
    const financialYear = this.extractFinancialYear(record.transaction_date);
    const mappedTransactionType = this.mapTransactionType(transactionType);

    return {
      transaction_no: record.transaction_no,
      transaction_date: record.transaction_date,
      financial_year: financialYear,
      transaction_type: transactionType,
      mapped_transaction_type: mappedTransactionType,
      debit_account: record.debit_account,
      debit_sub_account: record.debit_sub_account,
      debit_department: record.debit_department,
      debit_partner: record.debit_partner,
      debit_tax_category: record.debit_tax_category,
      debit_invoice: record.debit_invoice,
      debit_amount: debitAmount,
      credit_account: record.credit_account,
      credit_sub_account: record.credit_sub_account,
      credit_department: record.credit_department,
      credit_partner: record.credit_partner,
      credit_tax_category: record.credit_tax_category,
      credit_invoice: record.credit_invoice,
      credit_amount: creditAmount,
      description: record.description,
      tags: record.tags,
      memo: record.memo,
    };
  }

  private parseAmount(amountStr: string): number {
    if (!amountStr || amountStr.trim() === '') {
      return 0;
    }
    
    const cleaned = amountStr.replace(/[,\s]/g, '');
    const parsed = parseInt(cleaned, 10);
    
    return isNaN(parsed) ? 0 : parsed;
  }

  private determineTransactionType(
    debitAccount: string,
    creditAccount: string
  ): '収入' | '支出' | 'それ以外' {
    if (debitAccount === '普通預金') {
      return '収入';
    } else if (creditAccount === '普通預金') {
      return '支出';
    } else {
      return 'それ以外';
    }
  }

  public extractFinancialYear(dateString: string): number {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    return month >= 4 ? year : year - 1;
  }

  public mapTransactionType(type: '収入' | '支出' | 'それ以外'): TransactionType {
    switch (type) {
      case '収入':
        return 'income';
      case '支出':
        return 'expense';
      case 'それ以外':
        return 'other';
      default:
        return 'other';
    }
  }
}