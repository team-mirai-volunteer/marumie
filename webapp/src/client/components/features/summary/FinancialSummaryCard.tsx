"use client";
import "client-only";
import BaseCard from "@/client/components/ui/BaseCard";
import type { ValuePart } from "@/client/components/ui/ValueDisplay";
import ValueDisplay from "@/client/components/ui/ValueDisplay";
import type { FormattedAmount } from "@/server/utils/financial-calculator";

interface FinancialSummaryCardProps {
  title: string;
  amount: FormattedAmount;
  titleColor: string;
  amountColor: string;
  className?: string;
}

export default function FinancialSummaryCard({
  title,
  amount,
  titleColor,
  amountColor,
  className = "",
}: FinancialSummaryCardProps) {
  const parts: ValuePart[] = [];

  parts.push({ value: amount.main, isLarge: true, color: amountColor });
  if (amount.secondary) {
    parts.push({ value: amount.secondary, isLarge: false, color: amountColor });
  }
  if (amount.tertiary) {
    parts.push({ value: amount.tertiary, isLarge: true, color: amountColor });
  }
  parts.push({ value: amount.unit, isLarge: false, color: amountColor });

  return (
    <BaseCard className={className}>
      <div className={`font-bold text-base mb-4`} style={{ color: titleColor }}>
        {title}
      </div>
      <ValueDisplay parts={parts} />
    </BaseCard>
  );
}
