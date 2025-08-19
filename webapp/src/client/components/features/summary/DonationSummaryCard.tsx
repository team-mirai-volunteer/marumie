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
    <div
      className={`
        border border-[#E5E7EB]
        rounded-2xl
        p-6
        ${className}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="text-[#000000] font-bold text-base">{title}</div>
        {previousDayChange && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-[#6B7280]">前日比</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <title>Arrow up icon</title>
              <path
                d="M12 5l7 7-7 7"
                stroke="#238778"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M5 5l7 7"
                stroke="#238778"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <span className="text-[#238778] font-bold">
              {previousDayChange.value}
            </span>
            <span className="text-[#6B7280]">{previousDayChange.unit}</span>
          </div>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-[#000000] font-bold text-[40px] leading-[30px]">
          {value}
        </span>
        <span className="text-[#000000] font-bold text-base">{unit}</span>
      </div>
    </div>
  );
}
