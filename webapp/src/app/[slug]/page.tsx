import "server-only";
import SankeyChart from "@/client/components/features/sankey/SankeyChart";
import { getSankeyData } from "@/server/actions/get-sankey-data";

export default async function PoliticianPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // サーバーサイドでサンキーデータを取得
  const sankeyData = await getSankeyData({ slug });

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{slug}</h1>
      {sankeyData ? (
        <SankeyChart data={sankeyData} />
      ) : (
        <div className="text-gray-500">
          サンキー図データが取得できませんでした
        </div>
      )}
    </main>
  );
}
