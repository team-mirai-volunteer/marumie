import { convertToSankeyData } from "@/server/utils/sankey-converter";
import type { DisplayTransaction } from "@/types/display-transaction";

describe("convertToSankeyData", () => {
  const createMockDisplayTransaction = (
    overrides: Partial<DisplayTransaction> = {},
  ): DisplayTransaction => ({
    id: "test-id",
    date: new Date("2025-01-01"),
    yearmonth: "2025.01",
    transactionType: "income",
    category: "寄附金",
    subcategory: "個人寄附",
    tags: "",
    absAmount: 10000,
    amount: 10000,
    ...overrides,
  });

  it("should convert 10 transactions to proper sankey data structure", () => {
    const transactions: DisplayTransaction[] = [
      // 収入データ (4件)
      createMockDisplayTransaction({
        id: "income-1",
        transactionType: "income",
        category: "寄附金",
        subcategory: "個人寄附",
        absAmount: 100000,
      }),
      createMockDisplayTransaction({
        id: "income-2", 
        transactionType: "income",
        category: "寄附金",
        subcategory: "法人等寄附",
        absAmount: 200000,
      }),
      createMockDisplayTransaction({
        id: "income-3",
        transactionType: "income", 
        category: "機関紙誌収入",
        subcategory: "機関紙",
        absAmount: 50000,
      }),
      createMockDisplayTransaction({
        id: "income-4",
        transactionType: "income",
        category: "その他収入",
        subcategory: "雑収入",
        absAmount: 30000,
      }),
      
      // 支出データ (6件)
      createMockDisplayTransaction({
        id: "expense-1",
        transactionType: "expense",
        category: "政治活動費",
        subcategory: "組織活動費",
        absAmount: 80000,
      }),
      createMockDisplayTransaction({
        id: "expense-2",
        transactionType: "expense", 
        category: "政治活動費",
        subcategory: "選挙関係費",
        absAmount: 120000,
      }),
      createMockDisplayTransaction({
        id: "expense-3",
        transactionType: "expense",
        category: "経常経費", 
        subcategory: "人件費",
        absAmount: 100000,
      }),
      createMockDisplayTransaction({
        id: "expense-4",
        transactionType: "expense",
        category: "経常経費",
        subcategory: "光熱水費",
        absAmount: 40000,
      }),
      createMockDisplayTransaction({
        id: "expense-5",
        transactionType: "expense",
        category: "本部支部交付金",
        subcategory: "政治資金パーティー開催費",
        absAmount: 60000,
      }),
      createMockDisplayTransaction({
        id: "expense-6", 
        transactionType: "expense",
        category: "本部支部交付金",
        subcategory: "その他経費",
        absAmount: 20000,
      }),
    ];

    const result = convertToSankeyData(transactions);

    // ノードの検証
    expect(result.nodes).toHaveLength(17); // 5層構造: 4収入sub + 3収入cat + 1合計 + 3支出cat + 6支出sub
    
    // 収入サブカテゴリノードの確認
    expect(result.nodes).toEqual(
      expect.arrayContaining([
        { id: "income-sub-個人寄附", label: "個人寄附" },
        { id: "income-sub-法人等寄附", label: "法人等寄附" },
        { id: "income-sub-機関紙", label: "機関紙" },
        { id: "income-sub-雑収入", label: "雑収入" },
      ]),
    );

    // 収入カテゴリノードの確認
    expect(result.nodes).toEqual(
      expect.arrayContaining([
        { id: "income-cat-寄附金", label: "寄附金" },
        { id: "income-cat-機関紙誌収入", label: "機関紙誌収入" },
        { id: "income-cat-その他収入", label: "その他収入" },
      ]),
    );

    // 合計ノードの確認
    expect(result.nodes).toEqual(
      expect.arrayContaining([
        { id: "total", label: "合計" },
      ]),
    );

    // 支出カテゴリノードの確認
    expect(result.nodes).toEqual(
      expect.arrayContaining([
        { id: "expense-cat-政治活動費", label: "政治活動費" },
        { id: "expense-cat-経常経費", label: "経常経費" },
        { id: "expense-cat-本部支部交付金", label: "本部支部交付金" },
      ]),
    );

    // 支出サブカテゴリノードの確認
    expect(result.nodes).toEqual(
      expect.arrayContaining([
        { id: "expense-sub-組織活動費", label: "組織活動費" },
        { id: "expense-sub-選挙関係費", label: "選挙関係費" },
        { id: "expense-sub-人件費", label: "人件費" },
        { id: "expense-sub-光熱水費", label: "光熱水費" },
        { id: "expense-sub-政治資金パーティー開催費", label: "政治資金パーティー開催費" },
        { id: "expense-sub-その他経費", label: "その他経費" },
      ]),
    );

    // リンクの検証 
    expect(result.links).toHaveLength(16); // 4収入sub→cat + 3収入cat→合計 + 3合計→支出cat + 6支出cat→sub
    
    // 収入サブカテゴリ → 収入カテゴリのリンク
    expect(result.links).toEqual(
      expect.arrayContaining([
        { source: "income-sub-個人寄附", target: "income-cat-寄附金", value: 100000 },
        { source: "income-sub-法人等寄附", target: "income-cat-寄附金", value: 200000 },
        { source: "income-sub-機関紙", target: "income-cat-機関紙誌収入", value: 50000 },
        { source: "income-sub-雑収入", target: "income-cat-その他収入", value: 30000 },
      ]),
    );

    // 収入カテゴリ → 合計のリンク
    expect(result.links).toEqual(
      expect.arrayContaining([
        { source: "income-cat-寄附金", target: "total", value: 300000 },
        { source: "income-cat-機関紙誌収入", target: "total", value: 50000 },
        { source: "income-cat-その他収入", target: "total", value: 30000 },
      ]),
    );

    // 合計 → 支出カテゴリのリンク
    expect(result.links).toEqual(
      expect.arrayContaining([
        { source: "total", target: "expense-cat-政治活動費", value: 200000 },
        { source: "total", target: "expense-cat-経常経費", value: 140000 },
        { source: "total", target: "expense-cat-本部支部交付金", value: 80000 },
      ]),
    );

    // 支出カテゴリ → 支出サブカテゴリのリンク
    expect(result.links).toEqual(
      expect.arrayContaining([
        { source: "expense-cat-政治活動費", target: "expense-sub-組織活動費", value: 80000 },
        { source: "expense-cat-政治活動費", target: "expense-sub-選挙関係費", value: 120000 },
        { source: "expense-cat-経常経費", target: "expense-sub-人件費", value: 100000 },
        { source: "expense-cat-経常経費", target: "expense-sub-光熱水費", value: 40000 },
        { source: "expense-cat-本部支部交付金", target: "expense-sub-政治資金パーティー開催費", value: 60000 },
        { source: "expense-cat-本部支部交付金", target: "expense-sub-その他経費", value: 20000 },
      ]),
    );
  });
});