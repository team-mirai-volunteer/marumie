import { MfCsvLoader, MfCsvRecord } from '../../../src/server/lib/mf-csv-loader';

describe('MfCsvLoader', () => {
  let loader: MfCsvLoader;

  beforeEach(() => {
    loader = new MfCsvLoader();
  });

  describe('load', () => {
    it('should return empty array for empty CSV content', async () => {
      const result = await loader.load('');
      expect(result).toEqual([]);
    });

    it('should parse CSV content with headers', async () => {
      const csvContent = `取引No,取引日,借方勘定科目,借方補助科目,借方部門,借方取引先,借方税区分,借方インボイス,借方金額,貸方勘定科目,貸方補助科目,貸方部門,貸方取引先,貸方税区分,貸方インボイス,貸方金額,摘要,タグ,メモ
1,2025/6/6,普通預金,【公人】テスト銀行本店普通12345,対象外,,,,1500000,寄附金,,,,対象外,,,1500000,拠出 テスト太郎,`;

      const result = await loader.load(csvContent);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        transaction_no: '1',
        transaction_date: '2025/6/6',
        debit_account: '普通預金',
        debit_sub_account: '【公人】テスト銀行本店普通12345',
        debit_department: '対象外',
        debit_partner: '',
        debit_tax_category: '',
        debit_invoice: '',
        debit_amount: '1500000',
        credit_account: '寄附金',
        credit_sub_account: '',
        credit_department: '',
        credit_partner: '',
        credit_tax_category: '対象外',
        credit_invoice: '',
        credit_amount: '',
        description: '1500000',
        tags: '拠出 テスト太郎',
        memo: ''
      });
    });

    it('should handle multiple records', async () => {
      const csvContent = `取引No,取引日,借方勘定科目,借方補助科目,借方部門,借方取引先,借方税区分,借方インボイス,借方金額,貸方勘定科目,貸方補助科目,貸方部門,貸方取引先,貸方税区分,貸方インボイス,貸方金額,摘要,タグ,メモ
1,2025/6/6,普通預金,【公人】テスト銀行本店普通12345,対象外,,,,1500000,寄附金,,,,対象外,,,1500000,拠出 テスト太郎,
2,2025/6/7,事務費,備品購入,対象外,,,,50000,普通預金,【公人】テスト銀行本店普通12345,対象外,,,,50000,事務用品購入,備品,`;

      const result = await loader.load(csvContent);
      
      expect(result).toHaveLength(2);
      expect(result[0].transaction_no).toBe('1');
      expect(result[1].transaction_no).toBe('2');
    });

    it('should handle malformed CSV gracefully', async () => {
      const csvContent = 'invalid,csv,content';
      
      await expect(loader.load(csvContent)).rejects.toThrow();
    });

    it('should handle CSV with missing columns', async () => {
      const csvContent = `取引No,取引日
1,2025/6/6`;
      
      const result = await loader.load(csvContent);
      expect(result).toHaveLength(1);
      expect(result[0].transaction_no).toBe('1');
      expect(result[0].transaction_date).toBe('2025/6/6');
    });
  });
});