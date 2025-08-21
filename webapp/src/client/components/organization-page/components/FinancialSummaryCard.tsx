"use client";
import "client-only";
import BaseCard from "@/client/components/ui/BaseCard";
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
  return (
    <BaseCard className={className}>
      <div className={`font-bold text-base mb-4`} style={{ color: titleColor }}>
        {title}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="font-bold text-[40px] leading-[30px]"
          style={{ color: amountColor }}
        >
          {amount.main}
        </span>
        {amount.secondary && (
          <span className="font-bold text-base" style={{ color: amountColor }}>
            {amount.secondary}
          </span>
        )}
        {amount.tertiary && (
          <span
            className="font-bold text-[40px] leading-[30px]"
            style={{ color: amountColor }}
          >
            {amount.tertiary}
          </span>
        )}
        <span className="font-bold text-base leading-[30px]" style={{ color: amountColor }}>
          {amount.unit}
        </span>
      </div>
    </BaseCard>
  );
}
