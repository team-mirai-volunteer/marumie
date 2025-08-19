interface MainColumnProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainColumn({
  children,
  className = "",
}: MainColumnProps) {
  return (
    <main className={`mx-auto max-w-[1032px] px-6 py-6 space-y-6 ${className}`}>
      {children}
    </main>
  );
}
