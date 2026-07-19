import type { ReactNode } from "react";
import type { FormattedAmount } from "@/client/lib/financial-calculator";

interface AccessibleFormattedAmountProps {
  amount: FormattedAmount;
  children: ReactNode;
  visualClassName?: string;
}

function getAccessibleAmountText(amount: FormattedAmount): string {
  return `${amount.main}${amount.secondary}${amount.tertiary}${amount.unit}`;
}

export default function AccessibleFormattedAmount({
  amount,
  children,
  visualClassName,
}: AccessibleFormattedAmountProps) {
  return (
    <>
      <span className="sr-only">{getAccessibleAmountText(amount)}</span>
      <span aria-hidden="true" className={visualClassName}>
        {children}
      </span>
    </>
  );
}
