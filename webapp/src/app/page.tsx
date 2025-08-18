import Link from "next/link";
import { getAllPoliticalOrganizations } from "@/server/actions/get-all-political-organizations";

export default async function Home() {
  const politicalOrganizations = await getAllPoliticalOrganizations();

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">TOP</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">政治団体一覧</h2>
        <div className="space-y-3">
          {politicalOrganizations.map((org) => (
            <div key={org.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900">{org.name}</h3>
              {org.description && (
                <p className="text-gray-600 mt-1">{org.description}</p>
              )}
              <div className="flex gap-4 mt-3">
                <Link
                  href={`/${org.slug}`}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  詳細を見る
                </Link>
                <br />
                <Link
                  href={`/${org.slug}/transactions`}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  取引履歴
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
