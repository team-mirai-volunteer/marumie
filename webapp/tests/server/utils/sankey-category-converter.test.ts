import { convertCategoryAggregationToSankeyData } from "@/server/utils/sankey-category-converter";
import type { SankeyCategoryAggregationResult } from "@/server/repositories/interfaces/transaction-repository.interface";

describe("convertCategoryAggregationToSankeyData", () => {
  it("should convert category aggregation to sankey data with subcategories", () => {
    // テストデータの準備
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄附",
          subcategory: "個人からの寄附",
          totalAmount: 1000000,
        },
        {
          category: "寄附",
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

    const result = convertCategoryAggregationToSankeyData(aggregation, false, 0, 0);

    // ノードの検証（labelベースで検証、IDはハッシュ化されている）
    const nodeLabels = result.nodes.map(node => ({ label: node.label, nodeType: node.nodeType }));
    expect(nodeLabels).toEqual(
      expect.arrayContaining([
        // 収入サブカテゴリノード
        { label: "個人からの寄附", nodeType: "income-sub" },
        { label: "法人その他の団体からの寄附", nodeType: "income-sub" },
        // 収入カテゴリノード
        { label: "寄附", nodeType: "income" },
        { label: "その他の収入", nodeType: "income" },
        // 中央の合計ノード
        { label: "合計", nodeType: "total" },
        // 支出カテゴリノード
        { label: "政治活動費", nodeType: "expense" },
        { label: "経常経費", nodeType: "expense" },
        // 支出サブカテゴリノード
        { label: "宣伝費", nodeType: "expense-sub" },
        { label: "人件費", nodeType: "expense-sub" },
      ])
    );

    // リンクの検証（ノードをlabelで探してIDを取得）
    const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
    
    const individualDonationId = getNodeIdByLabel("個人からの寄附");
    const corporateDonationId = getNodeIdByLabel("法人その他の団体からの寄附");
    const donationCategoryId = getNodeIdByLabel("寄附");
    const otherIncomeCategoryId = getNodeIdByLabel("その他の収入");
    const totalId = getNodeIdByLabel("合計");
    const politicalActivityId = getNodeIdByLabel("政治活動費");
    const operationalExpenseId = getNodeIdByLabel("経常経費");
    const advertisingId = getNodeIdByLabel("宣伝費");
    const personnelId = getNodeIdByLabel("人件費");
    
    expect(result.links).toEqual(
      expect.arrayContaining([
        // 収入サブカテゴリ → 収入カテゴリ
        { source: individualDonationId, target: donationCategoryId, value: 1000000 },
        { source: corporateDonationId, target: donationCategoryId, value: 500000 },
        // 収入カテゴリ → 合計
        { source: donationCategoryId, target: totalId, value: 1500000 }, // 合計値
        { source: otherIncomeCategoryId, target: totalId, value: 200000 },
        // 合計 → 支出カテゴリ
        { source: totalId, target: politicalActivityId, value: 800000 },
        { source: totalId, target: operationalExpenseId, value: 900000 }, // 合計値
        // 支出カテゴリ → 支出サブカテゴリ
        { source: politicalActivityId, target: advertisingId, value: 800000 },
        { source: operationalExpenseId, target: personnelId, value: 600000 },
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
          category: "寄附",
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

    const result = convertCategoryAggregationToSankeyData(aggregation, false, 0, 0);

    // ノードの検証（サブカテゴリなし、現残高なし）
    const nodeLabels = result.nodes.map(node => ({ label: node.label, nodeType: node.nodeType }));
    expect(nodeLabels).toEqual(
      expect.arrayContaining([
        { label: "寄附", nodeType: "income" },
        { label: "合計", nodeType: "total" },
        { label: "政治活動費", nodeType: "expense" },
      ])
    );

    // リンクの検証（3層構造）
    const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
    const donationId = getNodeIdByLabel("寄附");
    const totalId = getNodeIdByLabel("合計");
    const politicalActivityId = getNodeIdByLabel("政治活動費");
    
    expect(result.links).toEqual(
      expect.arrayContaining([
        { source: donationId, target: totalId, value: 1000000 },
        { source: totalId, target: politicalActivityId, value: 1000000 },
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

    const result = convertCategoryAggregationToSankeyData(aggregation, false, 0, 0);

    // 合計ノードのみ
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].label).toBe("合計");
    expect(result.nodes[0].nodeType).toBe("total");

    // リンクなし
    expect(result.links).toEqual([]);
  });

  it("should avoid duplicate nodes", () => {
    // 同じカテゴリ/サブカテゴリが複数回出現する場合のテスト
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄附",
          subcategory: "個人からの寄附",
          totalAmount: 1000000,
        },
        {
          category: "寄附",
          subcategory: "個人からの寄附", // 重複
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

    const result = convertCategoryAggregationToSankeyData(aggregation, false, 0, 0);

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
          category: "寄附",
          subcategory: "個人からの寄附",
          totalAmount: 1000000,
        },
        {
          category: "寄附", // 同じカテゴリ、subcategoryなし
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

    const result = convertCategoryAggregationToSankeyData(aggregation, false, 0, 0);

    // 寄附カテゴリの合計値の検証（1000000 + 200000 = 1200000）
    const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
    const donationId = getNodeIdByLabel("寄附");
    const totalId = getNodeIdByLabel("合計");
    const individualDonationId = getNodeIdByLabel("個人からの寄附");
    
    const donateLinkToTotal = result.links.find(
      link => link.source === donationId && link.target === totalId
    );
    expect(donateLinkToTotal?.value).toBe(1200000);

    // サブカテゴリからカテゴリへのリンクも存在することを確認
    const subToCategory = result.links.find(
      link => link.source === individualDonationId && link.target === donationId
    );
    expect(subToCategory?.value).toBe(1000000);
  });

  it("should add '収支' when income > expense", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄附",
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

    const result = convertCategoryAggregationToSankeyData(aggregation, false, 0, 0);

    // 「(仕訳中)」ノードが追加されることを確認
    const processingNode = result.nodes.find(node => node.label === "(仕訳中)");
    expect(processingNode).toBeDefined();
    expect(processingNode?.label).toBe("(仕訳中)");

    // 「(仕訳中)」へのリンクが追加されることを確認
    const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
    const totalId = getNodeIdByLabel("合計");
    const processingId = getNodeIdByLabel("(仕訳中)");
    
    const linkToProcessing = result.links.find(
      link => link.source === totalId && link.target === processingId
    );
    expect(linkToProcessing).toBeDefined();
    expect(linkToProcessing?.value).toBe(800000); // 200万 - 120万 = 80万
  });

  it("should not add '収支' when income <= expense", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄附",
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

    const result = convertCategoryAggregationToSankeyData(aggregation, false, 0, 0);

    // 「(仕訳中)」ノードが追加されないことを確認
    const processingNode = result.nodes.find(node => node.label === "(仕訳中)");
    expect(processingNode).toBeUndefined();

    // 「(仕訳中)」へのリンクが追加されないことを確認
    const processingId = result.nodes.find(n => n.label === "(仕訳中)")?.id;
    const linkToProcessing = result.links.find(
      link => link.target === processingId
    );
    expect(linkToProcessing).toBeUndefined();
  });

  it("should handle '収支' with existing subcategories", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄附",
          subcategory: "個人からの寄附",
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

    const result = convertCategoryAggregationToSankeyData(aggregation, false, 0, 0);

    // 「(仕訳中)」ノードが追加されることを確認
    const processingNode = result.nodes.find(node => node.label === "(仕訳中)");
    expect(processingNode).toBeDefined();

    // 「(仕訳中)」のリンクが正しく追加されることを確認
    const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
    const totalId = getNodeIdByLabel("合計");
    const processingId = getNodeIdByLabel("(仕訳中)");
    const donationId = getNodeIdByLabel("寄附");
    const politicalActivityId = getNodeIdByLabel("政治活動費");
    const individualDonationId = getNodeIdByLabel("個人からの寄附");
    const advertisingId = getNodeIdByLabel("宣伝費");
    
    const linkToProcessing = result.links.find(
      link => link.source === totalId && link.target === processingId
    );
    expect(linkToProcessing?.value).toBe(1500000); // 300万 - 150万 = 150万

    // 既存のサブカテゴリ構造は維持されることを確認
    const subToCategory = result.links.find(
      link => link.source === individualDonationId && link.target === donationId
    );
    expect(subToCategory).toBeDefined();

    const categoryToSub = result.links.find(
      link => link.source === politicalActivityId && link.target === advertisingId
    );
    expect(categoryToSub).toBeDefined();
  });

  it("should handle currentYearBalance (繰越し)", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄附",
          totalAmount: 1000000,
        },
      ],
      expense: [
        {
          category: "政治活動費",
          totalAmount: 500000,
        },
      ],
    };

    const currentYearBalance = 300000;
    const result = convertCategoryAggregationToSankeyData(aggregation, false, currentYearBalance, 0);

    // 「繰越し」ノードが追加されることを確認
    const carryoverNode = result.nodes.find(node => node.label === "繰越し");
    expect(carryoverNode).toBeDefined();
    expect(carryoverNode?.nodeType).toBe("expense");

    // 「繰越し」へのリンクが追加されることを確認
    const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
    const totalId = getNodeIdByLabel("合計");
    const carryoverId = getNodeIdByLabel("繰越し");

    const linkToCarryover = result.links.find(
      link => link.source === totalId && link.target === carryoverId
    );
    expect(linkToCarryover).toBeDefined();
    expect(linkToCarryover?.value).toBe(300000);
  });

  it("should handle previousYearBalance (昨年からの繰越し)", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄附",
          totalAmount: 1000000,
        },
      ],
      expense: [
        {
          category: "政治活動費",
          totalAmount: 1000000,
        },
      ],
    };

    const previousYearBalance = 150000;
    const result = convertCategoryAggregationToSankeyData(aggregation, false, 0, previousYearBalance);

    // 「昨年からの繰越し」ノードが追加されることを確認
    const previousCarryoverNode = result.nodes.find(node => node.label === "昨年からの繰越し");
    expect(previousCarryoverNode).toBeDefined();
    expect(previousCarryoverNode?.nodeType).toBe("income");

    // 「昨年からの繰越し」からのリンクが追加されることを確認
    const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
    const previousCarryoverId = getNodeIdByLabel("昨年からの繰越し");
    const totalId = getNodeIdByLabel("合計");

    const linkFromPreviousCarryover = result.links.find(
      link => link.source === previousCarryoverId && link.target === totalId
    );
    expect(linkFromPreviousCarryover).toBeDefined();
    expect(linkFromPreviousCarryover?.value).toBe(150000);
  });

  it("should handle both currentYear and previousYear balances", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄附",
          totalAmount: 1000000,
        },
      ],
      expense: [
        {
          category: "政治活動費",
          totalAmount: 800000,
        },
      ],
    };

    const currentYearBalance = 200000;
    const previousYearBalance = 100000;
    const result = convertCategoryAggregationToSankeyData(aggregation, false, currentYearBalance, previousYearBalance);

    // 両方のノードが追加されることを確認
    const carryoverNode = result.nodes.find(node => node.label === "繰越し");
    const previousCarryoverNode = result.nodes.find(node => node.label === "昨年からの繰越し");

    expect(carryoverNode).toBeDefined();
    expect(previousCarryoverNode).toBeDefined();

    // リンクの検証
    const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
    const totalId = getNodeIdByLabel("合計");
    const carryoverId = getNodeIdByLabel("繰越し");
    const previousCarryoverId = getNodeIdByLabel("昨年からの繰越し");

    // 今年の繰越し
    const linkToCarryover = result.links.find(
      link => link.source === totalId && link.target === carryoverId
    );
    expect(linkToCarryover?.value).toBe(200000);

    // 昨年からの繰越し
    const linkFromPreviousCarryover = result.links.find(
      link => link.source === previousCarryoverId && link.target === totalId
    );
    expect(linkFromPreviousCarryover?.value).toBe(100000);

    // 収支バランスの確認（収入1000000 + 昨年100000 = 支出800000 + 今年200000 + (仕訳中)100000）
    const processingNode = result.nodes.find(node => node.label === "(仕訳中)");
    expect(processingNode).toBeDefined();

    const linkToProcessing = result.links.find(
      link => link.source === totalId && link.target === getNodeIdByLabel("(仕訳中)")
    );
    expect(linkToProcessing?.value).toBe(100000); // 1100000 - 800000 - 200000 = 100000
  });

  it("should not add carryover nodes when balances are zero", () => {
    const aggregation: SankeyCategoryAggregationResult = {
      income: [
        {
          category: "寄附",
          totalAmount: 1000000,
        },
      ],
      expense: [
        {
          category: "政治活動費",
          totalAmount: 1000000,
        },
      ],
    };

    const result = convertCategoryAggregationToSankeyData(aggregation, false, 0, 0);

    // 繰越しノードが追加されないことを確認
    const carryoverNode = result.nodes.find(node => node.label === "繰越し");
    const previousCarryoverNode = result.nodes.find(node => node.label === "昨年からの繰越し");

    expect(carryoverNode).toBeUndefined();
    expect(previousCarryoverNode).toBeUndefined();

    // 基本の3ノードのみ存在することを確認
    expect(result.nodes).toHaveLength(3);
    expect(result.links).toHaveLength(2);
  });

  describe("unrealized expenses integration", () => {
    it("should handle unrealized expenses under 繰越し category", () => {
      const aggregation: SankeyCategoryAggregationResult = {
        income: [
          {
            category: "寄附",
            totalAmount: 2000000,
          },
        ],
        expense: [
          {
            category: "政治活動費",
            totalAmount: 1000000,
          },
        ],
      };

      const unrealizedExpenses = [
        {
          category: "未払費用",
          subcategory: "未払費用",
          totalAmount: 500000,
        },
      ];

      const result = convertCategoryAggregationToSankeyData(
        aggregation,
        false,
        0,
        0,
        unrealizedExpenses,
      );

      // 「繰越し」ノードが追加されることを確認
      const carryoverNode = result.nodes.find(node => node.label === "繰越し");
      expect(carryoverNode).toBeDefined();
      expect(carryoverNode?.nodeType).toBe("expense");

      // 「未払費用」サブカテゴリノードが追加されることを確認
      const unrealizedNode = result.nodes.find(node => node.label === "未払費用");
      expect(unrealizedNode).toBeDefined();
      expect(unrealizedNode?.nodeType).toBe("expense-sub");

      // リンクの検証
      const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
      const totalId = getNodeIdByLabel("合計");
      const carryoverId = getNodeIdByLabel("繰越し");
      const unrealizedId = getNodeIdByLabel("未払費用");

      const linkToCarryover = result.links.find(
        link => link.source === totalId && link.target === carryoverId
      );
      expect(linkToCarryover).toBeDefined();
      expect(linkToCarryover?.value).toBe(500000); // 2000000 - 1000000 - 500000 = 500000

      const linkToUnrealized = result.links.find(
        link => link.source === carryoverId && link.target === unrealizedId
      );
      expect(linkToUnrealized).toBeDefined();
      expect(linkToUnrealized?.value).toBe(500000);
    });

    it("should handle multiple unrealized expense categories", () => {
      const aggregation: SankeyCategoryAggregationResult = {
        income: [
          {
            category: "寄附",
            totalAmount: 3000000,
          },
        ],
        expense: [
          {
            category: "政治活動費",
            totalAmount: 1500000,
          },
        ],
      };

      const unrealizedExpenses = [
        {
          category: "未払費用",
          subcategory: "未払費用",
          totalAmount: 800000,
        },
        {
          category: "未払費用",
          subcategory: "未払費用",
          totalAmount: 200000,
        },
      ];

      const result = convertCategoryAggregationToSankeyData(
        aggregation,
        false,
        0,
        0,
        unrealizedExpenses,
      );

      const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
      const carryoverId = getNodeIdByLabel("繰越し");
      const unrealizedId = getNodeIdByLabel("未払費用");

      const linkToUnrealized = result.links.find(
        link => link.source === carryoverId && link.target === unrealizedId
      );
      expect(linkToUnrealized?.value).toBe(800000); // First unrealized expense amount only
    });

    it("should handle unrealized expenses with existing currentYearBalance", () => {
      const aggregation: SankeyCategoryAggregationResult = {
        income: [
          {
            category: "寄附",
            totalAmount: 2000000,
          },
        ],
        expense: [
          {
            category: "政治活動費",
            totalAmount: 1000000,
          },
        ],
      };

      const unrealizedExpenses = [
        {
          category: "未払費用",
          subcategory: "未払費用",
          totalAmount: 300000,
        },
      ];

      const currentYearBalance = 400000;
      const result = convertCategoryAggregationToSankeyData(
        aggregation,
        false,
        currentYearBalance,
        0,
        unrealizedExpenses,
      );

      const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
      const totalId = getNodeIdByLabel("合計");
      const carryoverId = getNodeIdByLabel("繰越し");

      const linkToCarryover = result.links.find(
        link => link.source === totalId && link.target === carryoverId
      );
      expect(linkToCarryover?.value).toBe(700000); // 2000000 - 1000000 - 300000 = 700000
      
      const unrealizedId = getNodeIdByLabel("未払費用");
      const linkToUnrealized = result.links.find(
        link => link.source === carryoverId && link.target === unrealizedId
      );
      expect(linkToUnrealized?.value).toBe(300000);
    });

    it("should handle empty unrealized expenses array", () => {
      const aggregation: SankeyCategoryAggregationResult = {
        income: [
          {
            category: "寄附",
            totalAmount: 1500000,
          },
        ],
        expense: [
          {
            category: "政治活動費",
            totalAmount: 1000000,
          },
        ],
      };

      const unrealizedExpenses: Array<{ category: string; subcategory?: string; totalAmount: number }> = [];
      const currentYearBalance = 300000;

      const result = convertCategoryAggregationToSankeyData(
        aggregation,
        false,
        currentYearBalance,
        0,
        unrealizedExpenses,
      );

      const carryoverNode = result.nodes.find(node => node.label === "繰越し");
      const unrealizedNode = result.nodes.find(node => node.label === "未払費用");

      expect(carryoverNode).toBeDefined();
      expect(unrealizedNode).toBeUndefined();

      const getNodeIdByLabel = (label: string) => result.nodes.find(n => n.label === label)?.id;
      const totalId = getNodeIdByLabel("合計");
      const carryoverId = getNodeIdByLabel("繰越し");

      const linkToCarryover = result.links.find(
        link => link.source === totalId && link.target === carryoverId
      );
      expect(linkToCarryover?.value).toBe(300000); // 1500000 - 1000000 - 200000 (currentYearBalance) = 300000
    });
  });
});
