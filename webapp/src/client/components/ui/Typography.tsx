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
      fontFamily: "'Noto Sans JP', var(--font-noto-sans), sans-serif",
      fontWeight: 700
    }}
  >
    {children}
  </h1>
);

/**
 * Subtitle Component - Figma style_HTFODT
 * 14px, medium, line-height 1.21, letter-spacing 0.01em
 */
export const Subtitle = ({ children, className = "" }: TypographyProps) => (
  <p
    className={`text-[14px] font-medium leading-[1.21] tracking-[0.01em] ${className}`}
    style={{ fontFamily: "var(--font-noto-sans)" }}
  >
    {children}
  </p>
);

/**
 * Label Component - Figma style_YJIRG3
 * 11px, bold, line-height 1.55
 */
export const Label = ({ children, className = "" }: TypographyProps) => (
  <span
    className={`text-[11px] font-bold leading-[1.55] ${className}`}
    style={{ fontFamily: "var(--font-noto-sans)" }}
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
