import { MfCsvRecord } from './mf-csv-loader';
import { TransactionType, CreateTransactionInput } from '@/shared/model/transaction';


export class MfRecordConverter {
  constructor() {}

  public convertRow(record: MfCsvRecord, politicalOrganizationId: string): CreateTransactionInput {
    const debitAmount = this.parseAmount(record.debit_amount);
    const creditAmount = this.parseAmount(record.credit_amount);
    const transactionType = this.determineTransactionType(
      record.debit_account,
      record.credit_account
    );
    const financialYear = this.extractFinancialYear(record.transaction_date);

    return {
      political_organization_id: politicalOrganizationId,
      transaction_no: record.transaction_no,
      transaction_date: new Date(record.transaction_date),
      financial_year: financialYear,
      transaction_type: transactionType,
      debit_account: record.debit_account,
      debit_sub_account: record.debit_sub_account,
      debit_department: record.debit_department,
      debit_partner: record.debit_partner,
      debit_tax_category: record.debit_tax_category,
      debit_amount: debitAmount,
      credit_account: record.credit_account,
      credit_sub_account: record.credit_sub_account,
      credit_department: record.credit_department,
      credit_partner: record.credit_partner,
      credit_tax_category: record.credit_tax_category,
      credit_amount: creditAmount,
      description: record.description,
      description_1: record.tags,
      description_2: record.memo,
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
  ): TransactionType {
    if (debitAccount === '普通預金') {
      return 'income';
    } else if (creditAccount === '普通預金') {
      return 'expense';
    } else {
      return 'other';
    }
  }

  public extractFinancialYear(dateString: string): number {
    const startOfFinancialYear = 4;


    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return month >= startOfFinancialYear ? year : year - 1;
  }

}
