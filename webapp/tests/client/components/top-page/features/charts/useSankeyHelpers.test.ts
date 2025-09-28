import type { SankeyData, SankeyNode } from "@/types/sankey";

// ソートロジックをテストするために、hookの内部ロジックを抽出してテスト
// 実際のuseSankeyHelpersからソートロジックのみを抽出した関数

function calculateNodeValue(nodeId: string, links: Array<{ source: string; target: string; value: number }>) {
  const incomingLinks = links.filter((link) => link.target === nodeId);
  const outgoingLinks = links.filter((link) => link.source === nodeId);

  const totalValue =
    incomingLinks.length > 0
      ? incomingLinks.reduce((sum, link) => sum + (link.value || 0), 0)
      : outgoingLinks.reduce((sum, link) => sum + (link.value || 0), 0);

  return totalValue;
}

function sortNodesLogic(nodes: SankeyNode[], data: SankeyData): SankeyNode[] {
  return [...nodes].sort((a, b) => {
    // ノードタイプによる基本的な順序
    const typeOrder = {
      "income-sub": 0,
      income: 1,
      total: 2,
      expense: 3,
      "expense-sub": 4,
    } as const;

    const aOrder = typeOrder[a.nodeType as keyof typeof typeOrder] ?? 5;
    const bOrder = typeOrder[b.nodeType as keyof typeof typeOrder] ?? 5;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    // income, expense -> 単純に大きい順に並び替え
    if (a.nodeType === "income" || a.nodeType === "expense") {
      const aValue = calculateNodeValue(a.id, data.links);
      const bValue = calculateNodeValue(b.id, data.links);

      // income カテゴリでの特別処理
      if (a.nodeType === "income") {
        const aIsPreviousYearCarryover = a.label === "昨年からの現金残高";
        const bIsPreviousYearCarryover = b.label === "昨年からの現金残高";

        // 昨年からの現金残高 vs その他
        if (aIsPreviousYearCarryover && !bIsPreviousYearCarryover) return 1;
        if (bIsPreviousYearCarryover && !aIsPreviousYearCarryover) return -1;
      }

      // expense カテゴリでの特別処理
      if (a.nodeType === "expense") {
        const aIsCarryover = a.label === "現金残高";
        const bIsCarryover = b.label === "現金残高";
        const aIsProcessing = a.label === "(仕訳中)";
        const bIsProcessing = b.label === "(仕訳中)";

        // 現金残高 vs その他
        if (aIsCarryover && !bIsCarryover) return 1;
        if (bIsCarryover && !aIsCarryover) return -1;

        // (仕訳中) vs その他（現金残高以外）
        if (aIsProcessing && !bIsProcessing && !bIsCarryover) return 1;
        if (bIsProcessing && !aIsProcessing && !aIsCarryover) return -1;
      }

      return bValue - aValue; // 大きい順
    }

    // income-sub, expense-sub -> 親カテゴリの順序で並べ、同一親内で金額順
    if (a.nodeType === "income-sub" || a.nodeType === "expense-sub") {
      // 親カテゴリを特定
      const getParentCategory = (nodeId: string, nodeType: string) => {
        if (nodeType === "income-sub") {
          const link = data.links.find(
            (link) =>
              link.source === nodeId && link.target.startsWith("income-"),
          );
          return link?.target;
        } else if (nodeType === "expense-sub") {
          const link = data.links.find(
            (link) =>
              link.target === nodeId && link.source.startsWith("expense-"),
          );
          return link?.source;
        }
        return null;
      };

      const aParent = getParentCategory(a.id, a.nodeType!);
      const bParent = getParentCategory(b.id, b.nodeType!);

      // 親カテゴリが異なる場合は、親カテゴリの既定の順序に従う
      if (aParent && bParent && aParent !== bParent) {
        const parentA = data.nodes.find(n => n.id === aParent);
        const parentB = data.nodes.find(n => n.id === bParent);

        if (parentA && parentB) {
          const aParentValue = calculateNodeValue(aParent, data.links);
          const bParentValue = calculateNodeValue(bParent, data.links);

          // 親カテゴリに特別処理がある場合を考慮
          if (parentA.nodeType === "expense" && parentB.nodeType === "expense") {
            const aIsCarryover = parentA.label === "現金残高";
            const bIsCarryover = parentB.label === "現金残高";
            const aIsProcessing = parentA.label === "(仕訳中)";
            const bIsProcessing = parentB.label === "(仕訳中)";

            if (aIsCarryover && !bIsCarryover) return 1;
            if (bIsCarryover && !aIsCarryover) return -1;
            if (aIsProcessing && !bIsProcessing && !bIsCarryover) return 1;
            if (bIsProcessing && !aIsProcessing && !aIsCarryover) return -1;
          }

          if (parentA.nodeType === "income" && parentB.nodeType === "income") {
            const aIsPreviousYearCarryover = parentA.label === "昨年からの現金残高";
            const bIsPreviousYearCarryover = parentB.label === "昨年からの現金残高";

            if (aIsPreviousYearCarryover && !bIsPreviousYearCarryover) return 1;
            if (bIsPreviousYearCarryover && !aIsPreviousYearCarryover) return -1;
          }

          return bParentValue - aParentValue;
        }
      }

      // 同じ親カテゴリなら子カテゴリの金額で比較
      const aValue = calculateNodeValue(a.id, data.links);
      const bValue = calculateNodeValue(b.id, data.links);
      return bValue - aValue;
    }

    return 0;
  });
}

// テスト用のモックデータ
const createMockSankeyData = (): SankeyData => ({
  nodes: [
    {
      id: "income-sub-個人寄附",
      label: "個人寄附",
      nodeType: "income-sub",
    },
    {
      id: "income-寄附",
      label: "寄附",
      nodeType: "income",
    },
    {
      id: "total",
      label: "合計",
      nodeType: "total",
    },
    {
      id: "expense-政治活動費",
      label: "政治活動費",
      nodeType: "expense",
    },
    {
      id: "expense-現金残高",
      label: "現金残高",
      nodeType: "expense",
    },
    {
      id: "expense-sub-広告費",
      label: "広告費",
      nodeType: "expense-sub",
    },
    {
      id: "expense-sub-未払費用",
      label: "未払費用",
      nodeType: "expense-sub",
    },
  ],
  links: [
    {
      source: "income-sub-個人寄附",
      target: "income-寄附",
      value: 1000000,
    },
    {
      source: "income-寄附",
      target: "total",
      value: 1000000,
    },
    {
      source: "total",
      target: "expense-政治活動費",
      value: 400000,
    },
    {
      source: "total",
      target: "expense-現金残高",
      value: 600000,
    },
    {
      source: "expense-政治活動費",
      target: "expense-sub-広告費",
      value: 400000,
    },
    {
      source: "expense-現金残高",
      target: "expense-sub-未払費用",
      value: 100000,
    },
  ],
});

describe("SankeyHelpers Sorting Logic", () => {
  describe("sortNodesLogic", () => {
    it("should sort nodes by type in correct order", () => {
      const mockData = createMockSankeyData();

      const sortedNodes = sortNodesLogic(mockData.nodes, mockData);

      // ノードタイプの順序をチェック
      const nodeTypes = sortedNodes.map((node) => node.nodeType);
      expect(nodeTypes).toEqual([
        "income-sub",
        "income",
        "total",
        "expense",
        "expense",
        "expense-sub",
        "expense-sub",
      ]);
    });

    it("should sort expense categories with special handling for 現金残高", () => {
      const mockData = createMockSankeyData();
      const sortedNodes = sortNodesLogic(mockData.nodes, mockData);

      // expense カテゴリの順序をチェック
      const expenseNodes = sortedNodes.filter((node) => node.nodeType === "expense");
      expect(expenseNodes.map((node) => node.label)).toEqual([
        "政治活動費",
        "現金残高", // 現金残高が最後に来る
      ]);
    });

    it("should sort expense-sub nodes by parent category order then by amount", () => {
      const mockData = createMockSankeyData();
      const sortedNodes = sortNodesLogic(mockData.nodes, mockData);

      // expense-sub カテゴリの順序をチェック
      const expenseSubNodes = sortedNodes.filter((node) => node.nodeType === "expense-sub");
      expect(expenseSubNodes.map((node) => node.label)).toEqual([
        "広告費", // 政治活動費の子（親が先に来るため）
        "未払費用", // 現金残高の子（親が後に来るため）
      ]);
    });

    it("should handle income categories with special handling for 昨年からの現金残高", () => {
      const mockDataWithCarryover: SankeyData = {
        ...createMockSankeyData(),
        nodes: [
          ...createMockSankeyData().nodes,
          {
            id: "income-昨年からの現金残高",
            label: "昨年からの現金残高",
            nodeType: "income",
          },
        ],
        links: [
          ...createMockSankeyData().links,
          {
            source: "income-昨年からの現金残高",
            target: "total",
            value: 300000,
          },
        ],
      };

      const sortedNodes = sortNodesLogic(mockDataWithCarryover.nodes, mockDataWithCarryover);

      // income カテゴリの順序をチェック
      const incomeNodes = sortedNodes.filter((node) => node.nodeType === "income");
      expect(incomeNodes.map((node) => node.label)).toEqual([
        "寄附", // 通常の収入が先
        "昨年からの現金残高", // 昨年からの現金残高が最後
      ]);
    });
  });

  describe("calculateNodeValue", () => {
    it("should calculate node value correctly from incoming links", () => {
      const mockData = createMockSankeyData();

      // 合計ノードは入力リンクの合計
      const totalValue = calculateNodeValue("total", mockData.links);
      expect(totalValue).toBe(1000000);

      // expense-sub ノードは入力リンクの値
      const adValue = calculateNodeValue("expense-sub-広告費", mockData.links);
      expect(adValue).toBe(400000);
    });

    it("should calculate node value from outgoing links when no incoming links", () => {
      const mockData = createMockSankeyData();

      // income-sub ノードは出力リンクの値
      const incomeSubValue = calculateNodeValue("income-sub-個人寄附", mockData.links);
      expect(incomeSubValue).toBe(1000000);
    });
  });

  describe("edge cases", () => {
    it("should handle empty data", () => {
      const emptyData: SankeyData = { nodes: [], links: [] };

      const sortedNodes = sortNodesLogic([], emptyData);

      expect(sortedNodes).toEqual([]);
    });

    it("should handle nodes without parent relationships", () => {
      const dataWithOrphanNode: SankeyData = {
        nodes: [
          {
            id: "orphan-node",
            label: "孤立ノード",
            nodeType: "expense-sub",
          },
        ],
        links: [],
      };

      const sortedNodes = sortNodesLogic(dataWithOrphanNode.nodes, dataWithOrphanNode);

      expect(sortedNodes).toHaveLength(1);
      expect(sortedNodes[0].label).toBe("孤立ノード");
    });
  });
});