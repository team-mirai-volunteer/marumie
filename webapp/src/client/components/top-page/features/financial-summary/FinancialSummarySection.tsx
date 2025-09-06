import { formatAmount } from "@/server/utils/financial-calculator";
import type { SankeyData, SankeyLink } from "@/types/sankey";
import FinancialSummaryCard from "./FinancialSummaryCard";

interface FinancialSummarySectionProps {
  sankeyData: SankeyData | null;
}

// sankeyDataから財務データを計算する関数
function calculateFinancialData(sankeyData: SankeyData | null) {
  if (!sankeyData?.links) {
    return { income: 0, expense: 0, balance: 0 };
  }

  // 収入の計算（「合計」ノードへの流入）
  const income = sankeyData.links
    .filter((link: SankeyLink) => link.target === "合計")
    .reduce((sum: number, link: SankeyLink) => sum + link.value, 0);

  // 「繰越し」の値を取得（「合計」から「expense-繰越し」への流出）
  const carryoverLink = sankeyData.links.find(
    (link: SankeyLink) =>
      link.source === "合計" && link.target === "expense-繰越し",
  );
  const currentBalance = carryoverLink ? carryoverLink.value : 0;

  // 支出の計算（収入総額から現在の残高を引いた値）
  const expense = income - currentBalance;

  // 残高の計算（「expense-収支」への流出があればその値、なければ0）
  const balanceLink = sankeyData.links.find(
    (link: SankeyLink) => link.target === "expense-収支",
  );
  const balance = balanceLink ? balanceLink.value : 0;

  return { income, expense, balance: currentBalance };
}

export default function FinancialSummarySection({
  sankeyData,
}: FinancialSummarySectionProps) {
  // 財務データを計算
  const financialData = calculateFinancialData(sankeyData);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
      <FinancialSummaryCard
        className="flex-1"
        title="収入総額"
        amount={formatAmount(financialData.income)}
        titleColor="#238778"
        amountColor="#1F2937"
      />

      <FinancialSummaryCard
        className="flex-1"
        title="支出総額"
        amount={formatAmount(financialData.expense)}
        titleColor="#DC2626"
        amountColor="#1F2937"
      />

      <FinancialSummaryCard
        className="flex-1"
        title="現時点の収支"
        amount={formatAmount(financialData.balance)}
        titleColor="#1F2937"
        amountColor="#1F2937"
      />
    </div>
  );
}
