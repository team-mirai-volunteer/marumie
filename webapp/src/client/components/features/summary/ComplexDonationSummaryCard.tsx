"use client";
import "client-only";
import BaseCard from "@/client/components/ui/BaseCard";
import PreviousDayChange from "@/client/components/ui/PreviousDayChange";
import type { ValuePart } from "@/client/components/ui/ValueDisplay";
import ValueDisplay from "@/client/components/ui/ValueDisplay";

interface ComplexDonationSummaryCardProps {
  title: string;
  mainValue: string;
  secondaryValue?: string;
  tertiaryValue?: string;
  mainUnit?: string;
  secondaryUnit?: string;
  tertiaryUnit?: string;
  finalUnit: string;
  previousDayChange?: {
    value: string;
    unit: string;
  };
  className?: string;
}

export default function ComplexDonationSummaryCard({
  title,
  mainValue,
  secondaryValue,
  tertiaryValue,
  mainUnit,
  secondaryUnit,
  tertiaryUnit,
  finalUnit,
  previousDayChange,
  className = "",
}: ComplexDonationSummaryCardProps) {
  const parts: ValuePart[] = [];

  parts.push({ value: mainValue, isLarge: true });
  if (mainUnit) parts.push({ value: mainUnit, isLarge: false });
  if (secondaryValue) parts.push({ value: secondaryValue, isLarge: true });
  if (secondaryUnit) parts.push({ value: secondaryUnit, isLarge: false });
  if (tertiaryValue) parts.push({ value: tertiaryValue, isLarge: true });
  if (tertiaryUnit) parts.push({ value: tertiaryUnit, isLarge: false });
  parts.push({ value: finalUnit, isLarge: false });

  return (
    <BaseCard className={className}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-[#000000] font-bold text-base">{title}</div>
        {previousDayChange && (
          <PreviousDayChange
            value={previousDayChange.value}
            unit={previousDayChange.unit}
          />
        )}
      </div>
      <ValueDisplay parts={parts} />
    </BaseCard>
  );
}
