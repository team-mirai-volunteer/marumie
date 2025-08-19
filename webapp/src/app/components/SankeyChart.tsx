"use client";
import "client-only";

import { ResponsiveSankey } from "@nivo/sankey";
import { useEffect, useState } from "react";
import type { SankeyData } from "@/types/sankey";

export default function SankeyChart({ slug }: { slug: string }) {
  const [data, setData] = useState<SankeyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/p/${encodeURIComponent(slug)}/sankey`)
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error("Failed to fetch")),
      )
      .then((json) => {
        console.log("Sankey data:", json);
        if (isMounted) setData(json);
      })
      .catch((e) => {
        if (isMounted) setError(String(e));
      });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>Loading...</div>;

  // カスタム色設定関数
  const getNodeColor = (node: { id: string }) => {
    if (node.id.startsWith('income-')) {
      return '#2AA693'; // 収入のbox
    } else if (node.id === 'total') {
      return '#4F566B'; // 中央のbox
    } else if (node.id.startsWith('expense-')) {
      return '#EF4444'; // 支出のbox
    }
    return '#4F566B'; // デフォルト
  };



  return (
    <div style={{ height: 600 }} className="sankey-container">
      <style jsx global>{`
        .sankey-container svg path {
          fill: #E5E7EB !important;
          opacity: 0.6 !important;
        }
        .sankey-container svg path:hover {
          opacity: 0.8 !important;
        }
      `}</style>
      <ResponsiveSankey
        data={data}
        margin={{ top: 40, right: 160, bottom: 40, left: 160 }}
        align="justify"
        colors={getNodeColor}
        valueFormat={(v) => `¥${Math.round(v as number).toLocaleString("ja-JP")}`}
        nodeOpacity={1}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        nodeThickness={24}
        nodeSpacing={16}
        linkOpacity={0.5}
        linkHoverOpacity={0.8}
        enableLinkGradient={false}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
      />
    </div>
  );
}
