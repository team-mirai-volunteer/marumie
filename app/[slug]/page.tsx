import SankeyChart from "@/app/components/SankeyChart";

export default function PoliticianPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{slug}</h1>
      <SankeyChart slug={slug} />
    </main>
  );
}


