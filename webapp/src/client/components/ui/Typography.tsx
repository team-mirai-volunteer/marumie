import type { ReactNode } from "react";
interface TypographyProps {
  children: ReactNode;
  className?: string;
}

interface TitleProps extends TypographyProps {
  as?: "h1" | "h2" | "h3";
}

// Using Tailwind font classes for consistency

export const Title = ({ children, className = "", as = "h1" }: TitleProps) => {
  const Component = as;
  return (
    <Component
      className={`text-[20px] sm:text-[27px] leading-[1.52] tracking-[0.01em] font-japanese font-bold ${className}`}
    >
      {children}
    </Component>
  );
};

export const Subtitle = ({ children, className = "" }: TypographyProps) => (
  <p
    className={`text-[14px] leading-[1.21] tracking-[0.01em] font-japanese font-medium text-[var(--color-black-500)] ${className}`}
  >
    {children}
  </p>
);

export const Label = ({ children, className = "" }: TypographyProps) => (
  <span
    className={`text-[11px] leading-[1.55] font-japanese font-bold text-[var(--color-black-600)] ${className}`}
  >
    {children}
  </span>
);

export const Body = ({ children, className = "" }: TypographyProps) => (
  <p
    className={`text-[16px] font-bold leading-[1.75] font-english ${className}`}
  >
    {children}
  </p>
);
