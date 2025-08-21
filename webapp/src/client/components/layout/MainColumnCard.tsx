interface MainColumnCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function MainColumnCard({
  children,
  className = "",
  id,
}: MainColumnCardProps) {
  return (
    <div
      className={`bg-white rounded-[24px] p-12 space-y-8 scroll-mt-24 ${className}`}
      id={id}
    >
      {children}
    </div>
  );
}
