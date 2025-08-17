import { MfCsvLoader } from '../../../src/server/lib/mf-csv-loader';
import * as fs from 'fs';
import * as path from 'path';

describe('MfCsvLoader Encoding Tests', () => {
  let loader: MfCsvLoader;

  beforeEach(() => {
    loader = new MfCsvLoader();
  });

  describe('loadFromBuffer', () => {
    it('should handle Shift-JIS encoded CSV file', async () => {
      // Check if the actual CSV file exists
      const csvPath = path.join(__dirname, '../../../../data/【生データ取り扱い注意】仕訳帳_20250813_1148.csv');
      
      if (!fs.existsSync(csvPath)) {
        console.log('Skipping test: actual CSV file not found');
        return;
      }

      const buffer = fs.readFileSync(csvPath);
      
      const result = await loader.loadFromBuffer(buffer);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Check that the first record has proper Japanese text (not garbled)
      const firstRecord = result[0];
      expect(firstRecord.transaction_no).toBeTruthy();
      expect(firstRecord.transaction_date).toBeTruthy();
      expect(firstRecord.debit_account).toBeTruthy();
      
      // Check that Japanese characters are properly decoded
      expect(firstRecord.debit_account).not.toContain('�'); // No replacement characters
      expect(firstRecord.credit_account).not.toContain('�');
      
      console.log(`Successfully loaded ${result.length} records`);
      console.log(`First record: ${JSON.stringify(firstRecord, null, 2)}`);
    });
  });
});