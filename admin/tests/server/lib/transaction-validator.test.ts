import { TransactionValidator } from "@/server/lib/transaction-validator";
import { MfCsvRecord } from "@/server/lib/mf-csv-loader";

describe("TransactionValidator", () => {
  let validator: TransactionValidator;

  beforeEach(() => {
    validator = new TransactionValidator();
  });

  const createMockRecord = (
    overrides: Partial<MfCsvRecord> = {},
  ): MfCsvRecord => ({
    transaction_no: "1",
    transaction_date: "2025/6/6",
    debit_account: "人件費",
    debit_sub_account: "",
    debit_department: "",
    debit_partner: "",
    debit_tax_category: "",
    debit_invoice: "",
    debit_amount: "1000",
    credit_account: "普通預金",
    credit_sub_account: "",
    credit_department: "",
    credit_partner: "",
    credit_tax_category: "",
    credit_invoice: "",
    credit_amount: "1000",
    description: "",
    friendly_category: "テストカテゴリ",
    memo: "",
    ...overrides,
  });

  describe("validateRecords", () => {
    it("should return valid result for valid account labels", () => {
      const records = [
        createMockRecord({
          debit_account: "人件費",
          credit_account: "普通預金",
        }),
        createMockRecord({
          debit_account: "普通預金",
          credit_account: "個人からの寄附",
        }),
        createMockRecord({
          debit_account: "事務所費",
          credit_account: "普通預金",
        }),
      ];

      const result = validator.validateRecords(records);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.invalidAccountLabels).toHaveLength(0);
    });

    it("should allow 普通預金 as both debit and credit account", () => {
      const records = [
        createMockRecord({
          debit_account: "普通預金",
          credit_account: "人件費",
        }),
        createMockRecord({
          debit_account: "光熱水費",
          credit_account: "普通預金",
        }),
        createMockRecord({
          debit_account: "普通預金",
          credit_account: "普通預金",
        }),
      ];

      const result = validator.validateRecords(records);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.invalidAccountLabels).toHaveLength(0);
    });

    it("should return invalid result for invalid debit account", () => {
      const records = [
        createMockRecord({
          transaction_no: "TXN001",
          debit_account: "無効な借方科目",
          credit_account: "普通預金",
        }),
      ];

      const result = validator.validateRecords(records);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].record.transaction_no).toBe("TXN001");
      expect(result.errors[0].errors).toContain('無効な借方科目: "無効な借方科目"');
      expect(result.invalidAccountLabels).toContain("無効な借方科目");
    });

    it("should return invalid result for invalid credit account", () => {
      const records = [
        createMockRecord({
          transaction_no: "TXN002",
          debit_account: "人件費",
          credit_account: "無効な貸方科目",
        }),
      ];

      const result = validator.validateRecords(records);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].record.transaction_no).toBe("TXN002");
      expect(result.errors[0].errors).toContain('無効な貸方科目: "無効な貸方科目"');
      expect(result.invalidAccountLabels).toContain("無効な貸方科目");
    });

    it("should return invalid result for both invalid accounts", () => {
      const records = [
        createMockRecord({
          transaction_no: "TXN003",
          debit_account: "無効な借方科目",
          credit_account: "無効な貸方科目",
        }),
      ];

      const result = validator.validateRecords(records);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].record.transaction_no).toBe("TXN003");
      expect(result.errors[0].errors).toHaveLength(2);
      expect(result.errors[0].errors).toContain('無効な借方科目: "無効な借方科目"');
      expect(result.errors[0].errors).toContain('無効な貸方科目: "無効な貸方科目"');
      expect(result.invalidAccountLabels).toContain("無効な借方科目");
      expect(result.invalidAccountLabels).toContain("無効な貸方科目");
    });

    it("should handle multiple records with mixed valid and invalid accounts", () => {
      const records = [
        createMockRecord({
          transaction_no: "TXN004",
          debit_account: "人件費",
          credit_account: "普通預金",
        }),
        createMockRecord({
          transaction_no: "TXN005",
          debit_account: "無効な科目1",
          credit_account: "普通預金",
        }),
        createMockRecord({
          transaction_no: "TXN006",
          debit_account: "光熱水費",
          credit_account: "無効な科目2",
        }),
      ];

      const result = validator.validateRecords(records);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      
      const error1 = result.errors.find(e => e.record.transaction_no === "TXN005");
      const error2 = result.errors.find(e => e.record.transaction_no === "TXN006");
      
      expect(error1?.errors).toContain('無効な借方科目: "無効な科目1"');
      expect(error2?.errors).toContain('無効な貸方科目: "無効な科目2"');
      
      expect(result.invalidAccountLabels).toContain("無効な科目1");
      expect(result.invalidAccountLabels).toContain("無効な科目2");
      expect(result.invalidAccountLabels).toHaveLength(2);
    });

    it("should return valid result for empty records array", () => {
      const result = validator.validateRecords([]);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.invalidAccountLabels).toHaveLength(0);
    });

    it("should validate all account labels from ACCOUNT_CATEGORY_MAPPING", () => {
      // Test all income accounts
      const incomeRecords = [
        createMockRecord({
          debit_account: "普通預金",
          credit_account: "個人の負担する党費又は会費",
        }),
        createMockRecord({
          debit_account: "普通預金",
          credit_account: "個人からの寄附",
        }),
        createMockRecord({
          debit_account: "普通預金",
          credit_account: "法人その他の団体からの寄附",
        }),
        createMockRecord({
          debit_account: "普通預金",
          credit_account: "政治団体からの寄附",
        }),
        createMockRecord({
          debit_account: "普通預金",
          credit_account: "機関紙誌の発行その他の事業による収入",
        }),
      ];

      // Test all expense accounts
      const expenseRecords = [
        createMockRecord({
          debit_account: "人件費",
          credit_account: "普通預金",
        }),
        createMockRecord({
          debit_account: "光熱水費",
          credit_account: "普通預金",
        }),
        createMockRecord({
          debit_account: "組織活動費",
          credit_account: "普通預金",
        }),
        createMockRecord({
          debit_account: "選挙関係費",
          credit_account: "普通預金",
        }),
        createMockRecord({
          debit_account: "調査研究費",
          credit_account: "普通預金",
        }),
      ];

      const allRecords = [...incomeRecords, ...expenseRecords];
      const result = validator.validateRecords(allRecords);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.invalidAccountLabels).toHaveLength(0);
    });

    it("should collect all unique invalid account labels", () => {
      const records = [
        createMockRecord({
          transaction_no: "TXN007",
          debit_account: "重複する無効科目",
          credit_account: "普通預金",
        }),
        createMockRecord({
          transaction_no: "TXN008",
          debit_account: "重複する無効科目", // Same invalid account as above
          credit_account: "別の無効科目",
        }),
        createMockRecord({
          transaction_no: "TXN009",
          debit_account: "人件費",
          credit_account: "別の無効科目", // Same invalid account as above
        }),
      ];

      const result = validator.validateRecords(records);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.invalidAccountLabels).toHaveLength(2); // Only unique invalid labels
      expect(result.invalidAccountLabels).toContain("重複する無効科目");
      expect(result.invalidAccountLabels).toContain("別の無効科目");
    });
  });
});
