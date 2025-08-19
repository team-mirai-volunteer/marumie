"use client";
import "client-only";

interface PreviousDayChangeProps {
  value: string;
  unit: string;
}

export default function PreviousDayChange({
  value,
  unit,
}: PreviousDayChangeProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-[#6B7280]">前日比</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <title>Arrow up icon</title>
        <path d="M12 5l7 7-7 7" stroke="#238778" strokeWidth="2" fill="none" />
        <path d="M5 5l7 7" stroke="#238778" strokeWidth="2" fill="none" />
      </svg>
      <span className="text-[#238778] font-bold">{value}</span>
      <span className="text-[#6B7280]">{unit}</span>
    </div>
  );
}
