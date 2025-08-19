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
    <div
      className={`
        border border-[#E5E7EB]
        rounded-2xl
        p-6
        ${className}
      `}
    >
      <div className={`font-bold text-base mb-4`} style={{ color: titleColor }}>
        {title}
      </div>
      <div className="flex items-end gap-1">
        <span
          className="font-bold text-[40px] leading-[30px]"
          style={{ color: amountColor }}
        >
          {amount.main}
        </span>
        {amount.secondary && (
          <span
            className="font-bold text-base"
            style={{ color: amountColor }}
          >
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
        <span
          className="font-bold text-base"
          style={{ color: amountColor }}
        >
          {amount.unit}
        </span>
      </div>
    </div>
  );
}
