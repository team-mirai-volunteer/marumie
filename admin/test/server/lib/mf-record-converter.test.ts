import { MfRecordConverter, ConvertedMfRecord } from '../../../src/server/lib/mf-record-converter';
import { MfCsvRecord } from '../../../src/server/lib/mf-csv-loader';

describe('MfRecordConverter', () => {
  let converter: MfRecordConverter;

  beforeEach(() => {
    converter = new MfRecordConverter();
  });

  describe('convertRow', () => {
    const createMockRecord = (overrides: Partial<MfCsvRecord> = {}): MfCsvRecord => ({
      transaction_no: '1',
      transaction_date: '2025/6/6',
      debit_account: 'テスト借方',
      debit_sub_account: '',
      debit_department: '',
      debit_partner: '',
      debit_tax_category: '',
      debit_invoice: '',
      debit_amount: '1000',
      credit_account: 'テスト貸方',
      credit_sub_account: '',
      credit_department: '',
      credit_partner: '',
      credit_tax_category: '',
      credit_invoice: '',
      credit_amount: '1000',
      description: '',
      tags: '',
      memo: '',
      ...overrides,
    });

    it('should convert string amounts to integers', () => {
      const record = createMockRecord({
        debit_amount: '1500000',
        credit_amount: '500000',
      });

      const result = converter.convertRow(record);

      expect(result.debit_amount).toBe(1500000);
      expect(result.credit_amount).toBe(500000);
    });

    it('should handle amounts with commas', () => {
      const record = createMockRecord({
        debit_amount: '1,500,000',
        credit_amount: '500,000',
      });

      const result = converter.convertRow(record);

      expect(result.debit_amount).toBe(1500000);
      expect(result.credit_amount).toBe(500000);
    });

    it('should handle empty amounts as 0', () => {
      const record = createMockRecord({
        debit_amount: '',
        credit_amount: '',
      });

      const result = converter.convertRow(record);

      expect(result.debit_amount).toBe(0);
      expect(result.credit_amount).toBe(0);
    });

    it('should handle invalid amounts as 0', () => {
      const record = createMockRecord({
        debit_amount: 'invalid',
        credit_amount: 'abc123',
      });

      const result = converter.convertRow(record);

      expect(result.debit_amount).toBe(0);
      expect(result.credit_amount).toBe(0);
    });

    it('should set transaction_type to income when debit_account is 普通預金', () => {
      const record = createMockRecord({
        debit_account: '普通預金',
        credit_account: '寄附金',
      });

      const result = converter.convertRow(record);

      expect(result.transaction_type).toBe('income');
    });

    it('should set transaction_type to expense when credit_account is 普通預金', () => {
      const record = createMockRecord({
        debit_account: '事務費',
        credit_account: '普通預金',
      });

      const result = converter.convertRow(record);

      expect(result.transaction_type).toBe('expense');
    });

    it('should set transaction_type to other when neither account is 普通預金', () => {
      const record = createMockRecord({
        debit_account: '事務費',
        credit_account: '寄附金',
      });

      const result = converter.convertRow(record);

      expect(result.transaction_type).toBe('other');
    });

    it('should calculate financial year correctly', () => {
      // Test March (before April) - should be previous year
      const marchRecord = createMockRecord({
        transaction_date: '2025/3/15',
      });
      const marchResult = converter.convertRow(marchRecord);
      expect(marchResult.financial_year).toBe(2024);

      // Test April (start of fiscal year) - should be current year
      const aprilRecord = createMockRecord({
        transaction_date: '2025/4/1',
      });
      const aprilResult = converter.convertRow(aprilRecord);
      expect(aprilResult.financial_year).toBe(2025);

      // Test December (after April) - should be current year
      const decemberRecord = createMockRecord({
        transaction_date: '2025/12/31',
      });
      const decemberResult = converter.convertRow(decemberRecord);
      expect(decemberResult.financial_year).toBe(2025);
    });

    it('should preserve all other fields from the original record', () => {
      const record = createMockRecord({
        transaction_no: '123',
        transaction_date: '2025/12/31',
        debit_account: '普通預金',
        debit_sub_account: 'テスト銀行',
        tags: 'テストタグ',
        memo: 'テストメモ',
      });

      const result = converter.convertRow(record);

      expect(result.transaction_no).toBe('123');
      expect(result.transaction_date).toBe('2025/12/31');
      expect(result.debit_account).toBe('普通預金');
      expect(result.debit_sub_account).toBe('テスト銀行');
      expect(result.tags).toBe('テストタグ');
      expect(result.memo).toBe('テストメモ');
    });

    it('should prioritize debit_account when both accounts are 普通預金', () => {
      const record = createMockRecord({
        debit_account: '普通預金',
        credit_account: '普通預金',
      });

      const result = converter.convertRow(record);

      expect(result.transaction_type).toBe('income');
    });
  });

  describe('extractFinancialYear', () => {
    it('should return correct financial year for dates before April', () => {
      expect(converter.extractFinancialYear('2025/1/15')).toBe(2024);
      expect(converter.extractFinancialYear('2025/3/31')).toBe(2024);
    });

    it('should return correct financial year for dates from April onwards', () => {
      expect(converter.extractFinancialYear('2025/4/1')).toBe(2025);
      expect(converter.extractFinancialYear('2025/12/31')).toBe(2025);
    });
  });

});