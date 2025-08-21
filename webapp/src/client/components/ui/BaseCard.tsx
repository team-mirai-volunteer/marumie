"use client";
import "client-only";
import type { ReactNode } from "react";

interface BaseCardProps {
  children: ReactNode;
  className?: string;
}

export default function BaseCard({ children, className = "" }: BaseCardProps) {
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
