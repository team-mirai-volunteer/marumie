import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">poli-money-something</h1>
      <p>
        Try the demo Sankey chart at{' '}
        <Link className="text-blue-600 underline" href="/hoge">
          /hoge
        </Link>
        .
      </p>
    </main>
  );
}
