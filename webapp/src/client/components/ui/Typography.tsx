import type React from "react";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main Title Component - Figma style_4ED95B
 * 27px, bold (700), line-height 1.52, letter-spacing 0.01em
 * Matches Figma design exactly
 */
export const Title = ({ children, className = "" }: TypographyProps) => (
  <h1
    className={`text-[27px] leading-[1.52] tracking-[0.01em] ${className}`}
    style={{
      fontFamily: "'Noto Sans JP', var(--font-noto-sans-jp), var(--font-noto-sans), sans-serif",
      fontWeight: 700,
    }}
  >
    {children}
  </h1>
);

/**
 * Subtitle Component - Figma style_SG2NS4
 * 14px, medium (500), line-height 1.21, letter-spacing 0.01em
 * Used for "チームみらいはどこからお金を得て、何に使っているのか"
 */
export const Subtitle = ({ children, className = "" }: TypographyProps) => (
  <p
    className={`text-[14px] leading-[1.21] tracking-[0.01em] ${className}`}
    style={{
      fontFamily: "'Noto Sans JP', var(--font-noto-sans-jp), var(--font-noto-sans), sans-serif",
      fontWeight: 500,
      color: "var(--color-black-500)"
    }}
  >
    {children}
  </p>
);

/**
 * Label Component - Figma style_0MXVB5
 * 11px, bold (700), line-height 1.55
 * Used for "2025.8.14時点"
 */
export const Label = ({ children, className = "" }: TypographyProps) => (
  <span
    className={`text-[11px] leading-[1.55] ${className}`}
    style={{
      fontFamily: "'Noto Sans JP', var(--font-noto-sans-jp), var(--font-noto-sans), sans-serif",
      fontWeight: 700,
      color: "var(--color-black-600)"
    }}
  >
    {children}
  </span>
);

/**
 * Body Component - Figma style_FOQQO5
 * 16px, bold, line-height 1.75
 */
export const Body = ({ children, className = "" }: TypographyProps) => (
  <p
    className={`text-[16px] font-bold leading-[1.75] ${className}`}
    style={{ fontFamily: "var(--font-noto-sans)" }}
  >
    {children}
  </p>
);
