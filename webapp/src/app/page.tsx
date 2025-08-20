import "server-only";
import Link from "next/link";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumn from "@/client/components/layout/MainColumn";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import Icon from "@/client/components/ui/Icon";
import { getAllPoliticalOrganizations } from "@/server/actions/get-all-political-organizations";

export const dynamic = "force-dynamic";

export default async function Home() {
  const politicalOrganizations = await getAllPoliticalOrganizations();

  return (
    <MainColumn>
      <MainColumnCard>
        <CardHeader
          icon={<Icon />}
          title="政治団体一覧"
          updatedAt="2025.8.19時点"
          subtitle="登録されている政治団体の一覧を表示しています"
        />

        <section className="space-y-4 w-full">
          <div className="space-y-3">
            {politicalOrganizations.map((org) => (
              <div
                key={org.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {org.name}
                </h3>
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
      </MainColumnCard>
    </MainColumn>
  );
}
