"use client";
import "client-only";

export interface ValuePart {
  value: string;
  isLarge?: boolean;
  color?: string;
}

interface ValueDisplayProps {
  parts: ValuePart[];
  className?: string;
}

export default function ValueDisplay({
  parts,
  className = "",
}: ValueDisplayProps) {
  return (
    <div className={`flex items-end gap-1 ${className}`}>
      {parts.map((part, index) => (
        <span
          key={`${part.value}-${index}`}
          className={`font-bold ${part.isLarge ? "text-[40px] leading-[30px]" : "text-base"}`}
          style={{ color: part.color || "#000000" }}
        >
          {part.value}
        </span>
      ))}
    </div>
  );
}
