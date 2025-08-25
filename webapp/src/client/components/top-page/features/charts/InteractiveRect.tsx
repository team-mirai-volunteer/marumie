"use client";
import "client-only";

import type React from "react";

interface InteractiveRectProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  value?: number;
  onMouseEnter: (
    event: React.MouseEvent,
    nodeData: { id: string; value?: number },
  ) => void;
  onMouseLeave: () => void;
  onMouseMove: (event: React.MouseEvent) => void;
}

export default function InteractiveRect({
  id,
  x,
  y,
  width,
  height,
  fill,
  value,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
}: InteractiveRectProps) {
  return (
    /* biome-ignore lint/a11y/noStaticElementInteractions: SVG rect element needs mouse events for chart tooltip functionality */
    <rect
      key={id}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      opacity={1}
      aria-label={`${id}: ¥${Math.round(value || 0).toLocaleString("ja-JP")}`}
      onMouseEnter={(e) => onMouseEnter(e, { id, value })}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      style={{ cursor: "pointer" }}
    />
  );
}
