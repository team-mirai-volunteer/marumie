interface FinancialCellProps {
  children: React.ReactNode;
  className?: string;
}

export default function FinancialCell({
  children,
  className = '',
}: FinancialCellProps) {
  return (
    <div
      className={`
        border border-[#E5E7EB]
        rounded-2xl
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}
