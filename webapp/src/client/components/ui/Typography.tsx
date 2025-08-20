import type React from "react";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// Font family constants for DRY principle
const FONT_FAMILY_PRIMARY =
  "'Noto Sans JP', var(--font-noto-sans-jp), var(--font-noto-sans), sans-serif";
const FONT_FAMILY_SECONDARY = "var(--font-noto-sans)";

export const Title = ({ children, className = "" }: TypographyProps) => (
  <h1
    className={`text-[27px] leading-[1.52] tracking-[0.01em] ${className}`}
    style={{
      fontFamily: FONT_FAMILY_PRIMARY,
      fontWeight: 700,
    }}
  >
    {children}
  </h1>
);

export const Subtitle = ({ children, className = "" }: TypographyProps) => (
  <p
    className={`text-[14px] leading-[1.21] tracking-[0.01em] ${className}`}
    style={{
      fontFamily: FONT_FAMILY_PRIMARY,
      fontWeight: 500,
      color: "var(--color-black-500)",
    }}
  >
    {children}
  </p>
);

export const Label = ({ children, className = "" }: TypographyProps) => (
  <span
    className={`text-[11px] leading-[1.55] ${className}`}
    style={{
      fontFamily: FONT_FAMILY_PRIMARY,
      fontWeight: 700,
      color: "var(--color-black-600)",
    }}
  >
    {children}
  </span>
);

export const Body = ({ children, className = "" }: TypographyProps) => (
  <p
    className={`text-[16px] font-bold leading-[1.75] ${className}`}
    style={{ fontFamily: FONT_FAMILY_SECONDARY }}
  >
    {children}
  </p>
);
