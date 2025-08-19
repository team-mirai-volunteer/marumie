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

  return (
    <div style={{ height: 600 }}>
      <ResponsiveSankey
        data={data}
        margin={{ top: 40, right: 160, bottom: 40, left: 160 }}
        align="justify"
        colors={{ scheme: "nivo" }}
        valueFormat={(v) => `¥${Math.round(v as number).toLocaleString("ja-JP")}`}
        nodeOpacity={1}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        nodeThickness={24}
        nodeSpacing={16}
        linkOpacity={0.6}
        enableLinkGradient
        labelPosition="outside"
        labelOrientation="horizontal"
        labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
      />
    </div>
  );
}
