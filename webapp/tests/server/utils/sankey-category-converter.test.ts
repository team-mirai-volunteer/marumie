import { convertCategoryAggregationToSankeyData } from "@/server/utils/sankey-category-converter";
import type { SankeyCategoryAggregationResult } from "@/server/repositories/interfaces/transaction-repository.interface";

describe("convertCategoryAggregationToSankeyData", () => {
  it("should convert category aggregation to sankey data with subcategories", () => {
    // テストデータの準備
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄付",
          subcategory: "個人からの寄付",
          totalAmount: 1000000,
        },
        {
          category: "寄付",
          subcategory: "法人その他の団体からの寄附",
          totalAmount: 500000,
        },
        {
          category: "その他",
          totalAmount: 200000, // subcategoryなし
        },
      ],
      expense: [
        {
          category: "政治活動費",
          subcategory: "宣伝費",
          totalAmount: 800000,
        },
        {
          category: "経常経費",
          subcategory: "人件費",
          totalAmount: 600000,
        },
        {
          category: "経常経費",
          totalAmount: 300000, // subcategoryなし
        },
      ],
    };

    const result = convertCategoryAggregationToSankeyData(aggregation);

    // ノードの検証
    expect(result.nodes).toEqual(
      expect.arrayContaining([
        // 収入サブカテゴリノード
        { id: "個人からの寄付", label: "個人からの寄付" },
        { id: "法人その他の団体からの寄附", label: "法人その他の団体からの寄附" },
        // 収入カテゴリノード
        { id: "寄付", label: "寄付" },
        { id: "その他", label: "その他" },
        // 中央の合計ノード
        { id: "合計", label: "合計" },
        // 支出カテゴリノード
        { id: "政治活動費", label: "政治活動費" },
        { id: "経常経費", label: "経常経費" },
        // 支出サブカテゴリノード
        { id: "宣伝費", label: "宣伝費" },
        { id: "人件費", label: "人件費" },
      ])
    );

    // リンクの検証
    expect(result.links).toEqual(
      expect.arrayContaining([
        // 収入サブカテゴリ → 収入カテゴリ
        { source: "個人からの寄付", target: "寄付", value: 1000000 },
        { source: "法人その他の団体からの寄附", target: "寄付", value: 500000 },
        // 収入カテゴリ → 合計
        { source: "寄付", target: "合計", value: 1500000 }, // 合計値
        { source: "その他", target: "合計", value: 200000 },
        // 合計 → 支出カテゴリ
        { source: "合計", target: "政治活動費", value: 800000 },
        { source: "合計", target: "経常経費", value: 900000 }, // 合計値
        // 支出カテゴリ → 支出サブカテゴリ
        { source: "政治活動費", target: "宣伝費", value: 800000 },
        { source: "経常経費", target: "人件費", value: 600000 },
      ])
    );

    // ノード数の検証（重複なし）
    expect(result.nodes).toHaveLength(9);
    
    // リンク数の検証
    expect(result.links).toHaveLength(8);
  });

  it("should handle data without subcategories (with equal income and expense)", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄付",
          totalAmount: 1000000,
        },
      ],
      expense: [
        {
          category: "政治活動費",
          totalAmount: 1000000, // 収入と同額に変更
        },
      ],
    };

    const result = convertCategoryAggregationToSankeyData(aggregation);

    // ノードの検証（サブカテゴリなし、現残高なし）
    expect(result.nodes).toEqual(
      expect.arrayContaining([
        { id: "寄付", label: "寄付" },
        { id: "合計", label: "合計" },
        { id: "政治活動費", label: "政治活動費" },
      ])
    );

    // リンクの検証（3層構造）
    expect(result.links).toEqual(
      expect.arrayContaining([
        { source: "寄付", target: "合計", value: 1000000 },
        { source: "合計", target: "政治活動費", value: 1000000 },
      ])
    );

    expect(result.nodes).toHaveLength(3);
    expect(result.links).toHaveLength(2);
  });

  it("should handle empty aggregation data", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [],
      expense: [],
    };

    const result = convertCategoryAggregationToSankeyData(aggregation);

    // 合計ノードのみ
    expect(result.nodes).toEqual([
      { id: "合計", label: "合計" },
    ]);

    // リンクなし
    expect(result.links).toEqual([]);
  });

  it("should avoid duplicate nodes", () => {
    // 同じカテゴリ/サブカテゴリが複数回出現する場合のテスト
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄付",
          subcategory: "個人からの寄付",
          totalAmount: 1000000,
        },
        {
          category: "寄付",
          subcategory: "個人からの寄付", // 重複
          totalAmount: 500000,
        },
      ],
      expense: [
        {
          category: "政治活動費",
          subcategory: "宣伝費",
          totalAmount: 800000,
        },
      ],
    };

    const result = convertCategoryAggregationToSankeyData(aggregation);

    // ノードIDの重複がないことを確認
    const nodeIds = result.nodes.map(node => node.id);
    const uniqueNodeIds = [...new Set(nodeIds)];
    expect(nodeIds).toHaveLength(uniqueNodeIds.length);
  });

  it("should handle mixed category structures", () => {
    // 一部にsubcategoryがあり、一部にない混合状態のテスト
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄付",
          subcategory: "個人からの寄付",
          totalAmount: 1000000,
        },
        {
          category: "寄付", // 同じカテゴリ、subcategoryなし
          totalAmount: 200000,
        },
        {
          category: "その他",
          totalAmount: 300000,
        },
      ],
      expense: [
        {
          category: "政治活動費",
          subcategory: "宣伝費",
          totalAmount: 800000,
        },
        {
          category: "経常経費",
          totalAmount: 400000,
        },
      ],
    };

    const result = convertCategoryAggregationToSankeyData(aggregation);

    // 寄付カテゴリの合計値の検証（1000000 + 200000 = 1200000）
    const donateLinkToTotal = result.links.find(
      link => link.source === "寄付" && link.target === "合計"
    );
    expect(donateLinkToTotal?.value).toBe(1200000);

    // サブカテゴリからカテゴリへのリンクも存在することを確認
    const subToCategory = result.links.find(
      link => link.source === "個人からの寄付" && link.target === "寄付"
    );
    expect(subToCategory?.value).toBe(1000000);
  });

  it("should add '現残高' when income > expense", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄付",
          totalAmount: 2000000, // 収入合計：200万
        },
      ],
      expense: [
        {
          category: "政治活動費",
          totalAmount: 1200000, // 支出合計：120万
        },
      ],
    };

    const result = convertCategoryAggregationToSankeyData(aggregation);

    // 「現残高」ノードが追加されることを確認
    const currentBalanceNode = result.nodes.find(node => node.id === "現残高");
    expect(currentBalanceNode).toBeDefined();
    expect(currentBalanceNode?.label).toBe("現残高");

    // 「現残高」へのリンクが追加されることを確認
    const linkToCurrentBalance = result.links.find(
      link => link.source === "合計" && link.target === "現残高"
    );
    expect(linkToCurrentBalance).toBeDefined();
    expect(linkToCurrentBalance?.value).toBe(800000); // 200万 - 120万 = 80万
  });

  it("should not add '現残高' when income <= expense", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄付",
          totalAmount: 1000000, // 収入合計：100万
        },
      ],
      expense: [
        {
          category: "政治活動費",
          totalAmount: 1200000, // 支出合計：120万（支出の方が多い）
        },
      ],
    };

    const result = convertCategoryAggregationToSankeyData(aggregation);

    // 「現残高」ノードが追加されないことを確認
    const currentBalanceNode = result.nodes.find(node => node.id === "現残高");
    expect(currentBalanceNode).toBeUndefined();

    // 「現残高」へのリンクが追加されないことを確認
    const linkToCurrentBalance = result.links.find(
      link => link.target === "現残高"
    );
    expect(linkToCurrentBalance).toBeUndefined();
  });

  it("should handle '現残高' with existing subcategories", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄付",
          subcategory: "個人からの寄付",
          totalAmount: 3000000, // 収入合計：300万
        },
      ],
      expense: [
        {
          category: "政治活動費",
          subcategory: "宣伝費",
          totalAmount: 1500000, // 支出合計：150万
        },
      ],
    };

    const result = convertCategoryAggregationToSankeyData(aggregation);

    // 「現残高」ノードが追加されることを確認
    const currentBalanceNode = result.nodes.find(node => node.id === "現残高");
    expect(currentBalanceNode).toBeDefined();

    // 「現残高」のリンクが正しく追加されることを確認
    const linkToCurrentBalance = result.links.find(
      link => link.source === "合計" && link.target === "現残高"
    );
    expect(linkToCurrentBalance?.value).toBe(1500000); // 300万 - 150万 = 150万

    // 既存のサブカテゴリ構造は維持されることを確認
    const subToCategory = result.links.find(
      link => link.source === "個人からの寄付" && link.target === "寄付"
    );
    expect(subToCategory).toBeDefined();

    const categoryToSub = result.links.find(
      link => link.source === "政治活動費" && link.target === "宣伝費"
    );
    expect(categoryToSub).toBeDefined();
  });
});