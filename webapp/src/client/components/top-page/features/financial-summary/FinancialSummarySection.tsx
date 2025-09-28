import { formatAmount } from "@/server/utils/financial-calculator";
import type { SankeyData, SankeyLink } from "@/types/sankey";
import FinancialSummaryCard from "./FinancialSummaryCard";
import BalanceDetailCard from "./BalanceDetailCard";

interface FinancialSummarySectionProps {
  sankeyData: SankeyData | null;
}

// sankeyDataから財務データを計算する関数
function calculateFinancialData(sankeyData: SankeyData | null) {
  if (!sankeyData?.links || !sankeyData?.nodes) {
    return { income: 0, expense: 0, balance: 0 };
  }

  // 合計ノードのIDを取得
  const totalNode = sankeyData.nodes.find((node) => node.label === "合計");
  if (!totalNode) {
    return { income: 0, expense: 0, balance: 0 };
  }

  // 収入の計算（合計ノードへの流入）
  const income = sankeyData.links
    .filter((link: SankeyLink) => link.target === totalNode.id)
    .reduce((sum: number, link: SankeyLink) => sum + link.value, 0);

  // 繰越しノードのIDを取得（「合計」から「繰越し」への流出）
  const carryoverNode = sankeyData.nodes.find(
    (node) => node.label === "繰越し",
  );
  const carryoverLink = carryoverNode
    ? sankeyData.links.find(
        (link: SankeyLink) =>
          link.source === totalNode.id && link.target === carryoverNode.id,
      )
    : null;
  const currentBalance = carryoverLink ? carryoverLink.value : 0;

  // 支出の計算（収入総額から現在の残高を引いた値）
  const expense = income - currentBalance;

  return { income, expense, balance: currentBalance };
}

// sankeyDataから収支詳細データを計算する関数
function calculateBalanceDetailData(sankeyData: SankeyData | null) {
  if (!sankeyData?.links || !sankeyData?.nodes) {
    return { balance: 0, cashBalance: 0, unpaidExpense: 0 };
  }

  // 合計ノードのIDを取得
  const totalNode = sankeyData.nodes.find((node) => node.label === "合計");
  if (!totalNode) {
    return { balance: 0, cashBalance: 0, unpaidExpense: 0 };
  }

  // 現金残高カテゴリノードを取得
  const cashBalanceNode = sankeyData.nodes.find(
    (node) => node.label === "現金残高" && node.nodeType === "expense",
  );
  if (!cashBalanceNode) {
    return { balance: 0, cashBalance: 0, unpaidExpense: 0 };
  }

  // 現金残高の合計値を取得（合計から現金残高への流入）
  const cashBalanceTotal = sankeyData.links
    .filter(
      (link: SankeyLink) =>
        link.source === totalNode.id && link.target === cashBalanceNode.id,
    )
    .reduce((sum: number, link: SankeyLink) => sum + link.value, 0);

  // 収支サブカテゴリノードを取得
  const balanceSubNode = sankeyData.nodes.find(
    (node) => node.label === "収支" && node.nodeType === "expense-sub",
  );
  const balanceValue = balanceSubNode
    ? sankeyData.links
        .filter(
          (link: SankeyLink) =>
            link.source === cashBalanceNode.id &&
            link.target === balanceSubNode.id,
        )
        .reduce((sum: number, link: SankeyLink) => sum + link.value, 0)
    : 0;

  // 未払費用サブカテゴリノードを取得
  const unpaidExpenseSubNode = sankeyData.nodes.find(
    (node) => node.label === "未払費用" && node.nodeType === "expense-sub",
  );
  const unpaidExpenseValue = unpaidExpenseSubNode
    ? sankeyData.links
        .filter(
          (link: SankeyLink) =>
            link.source === cashBalanceNode.id &&
            link.target === unpaidExpenseSubNode.id,
        )
        .reduce((sum: number, link: SankeyLink) => sum + link.value, 0)
    : 0;

  return {
    balance: balanceValue,
    cashBalance: cashBalanceTotal,
    unpaidExpense: unpaidExpenseValue,
  };
}

export default function FinancialSummarySection({
  sankeyData,
}: FinancialSummarySectionProps) {
  // 財務データを計算
  const financialData = calculateFinancialData(sankeyData);
  const balanceDetailData = calculateBalanceDetailData(sankeyData);

  return (
    <div className="flex flex-col md:flex-row gap-2 items-center">
      <FinancialSummaryCard
        className="w-full md:flex-1"
        title="収入総額"
        amount={formatAmount(financialData.income)}
        titleColor="#238778"
        amountColor="#1F2937"
      />

      <FinancialSummaryCard
        className="w-full md:flex-1"
        title="支出総額"
        amount={formatAmount(financialData.expense)}
        titleColor="#DC2626"
        amountColor="#1F2937"
      />

      <BalanceDetailCard
        className="w-full md:w-auto"
        balance={balanceDetailData.balance}
        cashBalance={balanceDetailData.cashBalance}
        unpaidExpense={balanceDetailData.unpaidExpense}
      />
    </div>
  );
}
