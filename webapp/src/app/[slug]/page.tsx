import "server-only";
import Image from "next/image";
import SankeyChart from "@/client/components/features/sankey/SankeyChart";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumn from "@/client/components/layout/MainColumn";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
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
    <MainColumn>
      <MainColumnCard>
        <CardHeader
          icon={
            <Image
              src="/cashflow.svg"
              alt="Cash flow icon"
              width={30}
              height={31}
            />
          }
          title="チームみらいの収支の流れ"
          updatedAt="2025.8.14時点"
          subtitle="チームみらいはどこからお金を得て、何に使っているのか"
        />
        {sankeyData ? (
          <SankeyChart data={sankeyData} />
        ) : (
          <div className="text-gray-500">
            サンキー図データが取得できませんでした
          </div>
        )}
      </MainColumnCard>
    </MainColumn>
  );
}
