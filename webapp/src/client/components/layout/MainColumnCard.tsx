interface MainColumnCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainColumnCard({
  children,
  className = "",
}: MainColumnCardProps) {
  return (
    <div className={`bg-white rounded-[24px] p-12 space-y-8 ${className}`}>
      {children}
    </div>
  );
}
