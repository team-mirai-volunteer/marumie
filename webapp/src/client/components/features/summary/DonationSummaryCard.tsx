"use client";
import "client-only";
import BaseCard from "@/client/components/ui/BaseCard";
import PreviousDayChange from "@/client/components/ui/PreviousDayChange";
import ValueDisplay from "@/client/components/ui/ValueDisplay";

interface DonationSummaryCardProps {
  title: string;
  value: string;
  unit: string;
  previousDayChange?: {
    value: string;
    unit: string;
  };
  className?: string;
}

export default function DonationSummaryCard({
  title,
  value,
  unit,
  previousDayChange,
  className = "",
}: DonationSummaryCardProps) {
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
      <ValueDisplay
        parts={[
          { value, isLarge: true },
          { value: unit, isLarge: false },
        ]}
      />
    </BaseCard>
  );
}
