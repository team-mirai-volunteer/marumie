import SankeyChart from "@/app/components/SankeyChart";

export default async function PoliticianPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{slug}</h1>
      <SankeyChart />
    </main>
  );
}


