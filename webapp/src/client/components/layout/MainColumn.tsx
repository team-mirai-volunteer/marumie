interface MainColumnProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainColumn({
  children,
  className = "",
}: MainColumnProps) {
  return (
    <main
      className={`mx-auto max-w-[1032px] px-5 sm:px-6 pt-2 pb-[60px] sm:pb-6 space-y-12 ${className}`}
    >
      {children}
    </main>
  );
}
