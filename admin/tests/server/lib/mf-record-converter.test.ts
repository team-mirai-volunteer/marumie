import { MfRecordConverter } from "@/server/lib/mf-record-converter";
import { MfCsvRecord } from "@/server/lib/mf-csv-loader";

describe("MfRecordConverter", () => {
  let converter: MfRecordConverter;

  beforeEach(() => {
    converter = new MfRecordConverter();
  });

  describe("convertRow", () => {
    const createMockRecord = (
      overrides: Partial<MfCsvRecord> = {},
    ): MfCsvRecord => ({
      transaction_no: "1",
      transaction_date: "2025/6/6",
      debit_account: "テスト借方",
      debit_sub_account: "",
      debit_department: "",
      debit_partner: "",
      debit_tax_category: "",
      debit_invoice: "",
      debit_amount: "1000",
      credit_account: "テスト貸方",
      credit_sub_account: "",
      credit_department: "",
      credit_partner: "",
      credit_tax_category: "",
      credit_invoice: "",
      credit_amount: "1000",
      description: "",
      friendly_category: "",
      memo: "",
      ...overrides,
    });

    it("should convert string amounts to integers", () => {
      const record = createMockRecord({
        debit_amount: "1500000",
        credit_amount: "500000",
      });

      const result = converter.convertRow(record, "test-org-id");

      expect(result.debit_amount).toBe(1500000);
      expect(result.credit_amount).toBe(500000);
      expect(result.transaction_type).toBe(null);
    });

    it("should handle amounts with commas", () => {
      const record = createMockRecord({
        debit_amount: "1,500,000",
        credit_amount: "500,000",
      });

      const result = converter.convertRow(record, "test-org-id");

      expect(result.debit_amount).toBe(1500000);
      expect(result.credit_amount).toBe(500000);
    });

    it("should handle empty amounts as 0", () => {
      const record = createMockRecord({
        debit_amount: "",
        credit_amount: "",
      });

      const result = converter.convertRow(record, "test-org-id");

      expect(result.debit_amount).toBe(0);
      expect(result.credit_amount).toBe(0);
    });

    it("should handle invalid amounts as 0", () => {
      const record = createMockRecord({
        debit_amount: "invalid",
        credit_amount: "abc123",
      });

      const result = converter.convertRow(record, "test-org-id");

      expect(result.debit_amount).toBe(0);
      expect(result.credit_amount).toBe(0);
    });

    it("should set transaction_type to income when debit_account is 普通預金", () => {
      const record = createMockRecord({
        debit_account: "普通預金",
        credit_account: "寄附金",
      });

      const result = converter.convertRow(record, "test-org-id");

      expect(result.transaction_type).toBe("income");
    });

    it("should set transaction_type to expense when credit_account is 普通預金", () => {
      const record = createMockRecord({
        debit_account: "事務費",
        credit_account: "普通預金",
      });

      const result = converter.convertRow(record, "test-org-id");

      expect(result.transaction_type).toBe("expense");
    });

    it("should set transaction_type to other when neither account is 普通預金", () => {
      const record = createMockRecord({
        debit_account: "事務費",
        credit_account: "寄附金",
      });

      const result = converter.convertRow(record, "test-org-id");

      expect(result.transaction_type).toBe(null);
    });


    it("should preserve all other fields from the original record", () => {
      const record = createMockRecord({
        transaction_no: "123",
        transaction_date: "2025/12/31",
        debit_account: "普通預金",
        debit_sub_account: "テスト銀行",
        friendly_category: "テストタグ",
        memo: "テストメモ",
      });

      const result = converter.convertRow(record, "test-org-id");

      expect(result.political_organization_id).toBe("test-org-id");
      expect(result.transaction_no).toBe("123");
      expect(result.transaction_date).toEqual(new Date("2025/12/31"));
      expect(result.debit_account).toBe("普通預金");
      expect(result.debit_sub_account).toBe("テスト銀行");
      expect(result.friendly_category).toBe("テストタグ");
    });

    it("should prioritize debit_account when both accounts are 普通預金", () => {
      const record = createMockRecord({
        debit_account: "普通預金",
        credit_account: "普通預金",
      });

      const result = converter.convertRow(record, "test-org-id");

      expect(result.transaction_type).toBe("income");
    });

    describe("description splitting logic", () => {
      it("should split description with 1 word into description_1 only", () => {
        const record = createMockRecord({
          description: "振込1",
        });

        const result = converter.convertRow(record, "test-org-id");

        expect(result.description).toBe("振込1");
        expect(result.description_1).toBe("振込1");
        expect(result.description_2).toBeUndefined();
        expect(result.description_3).toBeUndefined();
      });

      it("should split description with 2 words into description_1 and description_3", () => {
        const record = createMockRecord({
          description: "振込1 TEAM",
        });

        const result = converter.convertRow(record, "test-org-id");

        expect(result.description).toBe("振込1 TEAM");
        expect(result.description_1).toBe("振込1");
        expect(result.description_2).toBeUndefined();
        expect(result.description_3).toBe("TEAM");
      });

      it("should split description with 3 words into description_1, description_2, and description_3", () => {
        const record = createMockRecord({
          description: "振込1 テスト タロウ",
        });

        const result = converter.convertRow(record, "test-org-id");

        expect(result.description).toBe("振込1 テスト タロウ");
        expect(result.description_1).toBe("振込1");
        expect(result.description_2).toBe("テスト");
        expect(result.description_3).toBe("タロウ");
      });

      it("should split description with 4+ words and combine 3rd+ words into description_3", () => {
        const record = createMockRecord({
          description: "振込1 A B C D E",
        });

        const result = converter.convertRow(record, "test-org-id");

        expect(result.description).toBe("振込1 A B C D E");
        expect(result.description_1).toBe("振込1");
        expect(result.description_2).toBe("A");
        expect(result.description_3).toBe("B C D E");
      });

      it("should handle empty description", () => {
        const record = createMockRecord({
          description: "",
        });

        const result = converter.convertRow(record, "test-org-id");

        expect(result.description).toBe("");
        expect(result.description_1).toBeUndefined();
        expect(result.description_2).toBeUndefined();
        expect(result.description_3).toBeUndefined();
      });

      it("should handle description with multiple spaces", () => {
        const record = createMockRecord({
          description: "振込1   TEAM   NAME",
        });

        const result = converter.convertRow(record, "test-org-id");

        expect(result.description).toBe("振込1   TEAM   NAME");
        expect(result.description_1).toBe("振込1");
        expect(result.description_2).toBe("TEAM");
        expect(result.description_3).toBe("NAME");
      });
    });

    it("should preserve friendly_category field as-is", () => {
      const record = createMockRecord({
        friendly_category: "テストタグ値",
      });

      const result = converter.convertRow(record, "test-org-id");

      expect(result.friendly_category).toBe("テストタグ値");
    });
  });

  describe("extractFinancialYear", () => {
    it("should return correct financial year for calendar year dates", () => {
      expect(converter.extractFinancialYear("2025/1/1")).toBe(2025);
      expect(converter.extractFinancialYear("2025/3/31")).toBe(2025);
      expect(converter.extractFinancialYear("2025/6/15")).toBe(2025);
      expect(converter.extractFinancialYear("2025/12/31")).toBe(2025);
    });
  });
});
