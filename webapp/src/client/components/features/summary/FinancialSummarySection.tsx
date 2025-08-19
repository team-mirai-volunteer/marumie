import FinancialSummaryCard from "./FinancialSummaryCard";
import { formatAmount } from "@/server/utils/financial-calculator";
import type { SankeyData, SankeyLink } from "@/types/sankey";

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

  // 支出の計算（「合計」ノードからの流出、ただし「現残高」は除く）
  const expense = sankeyData.links
    .filter(
      (link: SankeyLink) => link.source === "合計" && link.target !== "現残高",
    )
    .reduce((sum: number, link: SankeyLink) => sum + link.value, 0);

  // 残高の計算（「現残高」への流出があればその値、なければ0）
  const balanceLink = sankeyData.links.find(
    (link: SankeyLink) => link.target === "現残高",
  );
  const balance = balanceLink ? balanceLink.value : 0;

  return { income, expense, balance };
}

export default function FinancialSummarySection({
  sankeyData,
}: FinancialSummarySectionProps) {
  // 財務データを計算
  const financialData = calculateFinancialData(sankeyData);

  return (
    <div className="flex items-center gap-6">
      <FinancialSummaryCard
        className="flex-1"
        title="収入"
        amount={formatAmount(financialData.income)}
        titleColor="#238778"
        amountColor="#1F2937"
      />

      <FinancialSummaryCard
        className="flex-1"
        title="支出"
        amount={formatAmount(financialData.expense)}
        titleColor="#DC2626"
        amountColor="#1F2937"
      />

      <FinancialSummaryCard
        className="flex-1"
        title="現在の残高"
        amount={formatAmount(financialData.balance)}
        titleColor="#000000"
        amountColor="#000000"
      />
    </div>
  );
}
