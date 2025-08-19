"use client";
import "client-only";

import { ResponsiveSankey } from "@nivo/sankey";
import { useEffect, useState } from "react";

type SankeyData = {
  nodes: { id: string }[];
  links: { source: string; target: string; value: number }[];
};

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
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        align="justify"
        colors={{ scheme: "category10" }}
        valueFormat={(v) => Math.round(v as number).toLocaleString("ja-JP")}
        nodeOpacity={1}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        linkOpacity={0.5}
        enableLinkGradient
      />
    </div>
  );
}
