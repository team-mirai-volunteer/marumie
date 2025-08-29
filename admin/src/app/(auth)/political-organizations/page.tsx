"use client";
import "client-only";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/client/clients/api-client";
import type { PoliticalOrganization } from "@/shared/models/political-organization";

export default function PoliticalOrganizationsPage() {
  const [organizations, setOrganizations] = useState<PoliticalOrganization[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const data = await apiClient.listPoliticalOrganizations();
        setOrganizations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className="bg-primary-panel rounded-xl p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">政治団体一覧</h1>
        <Link
          href="/political-organizations/new"
          className="bg-primary-accent text-white border-0 rounded-lg px-4 py-2.5 font-medium no-underline hover:bg-blue-600 transition-colors duration-200"
        >
          新規作成
        </Link>
      </div>

      {loading && <p className="text-primary-muted">読み込み中...</p>}

      {error && (
        <div className="text-red-500 mt-4 p-3 bg-red-900/20 rounded-lg border border-red-900/30">
          エラー: {error}
        </div>
      )}

      {!loading && !error && organizations.length === 0 && (
        <div className="text-center py-10">
          <p className="text-primary-muted">政治団体が登録されていません</p>
          <Link
            href="/political-organizations/new"
            className="bg-primary-accent text-white border-0 rounded-lg px-4 py-2.5 font-medium no-underline hover:bg-blue-600 transition-colors duration-200 mt-4 inline-block"
          >
            最初の政治団体を作成
          </Link>
        </div>
      )}

      {!loading && !error && organizations.length > 0 && (
        <div className="mt-5">
          <div className="grid gap-3">
            {organizations.map((org) => (
              <div key={org.id} className="bg-primary-input rounded-xl p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-2 mt-0">
                      {org.name}
                    </h3>
                    {org.description && (
                      <p className="text-primary-muted mb-3 mt-0">
                        {org.description}
                      </p>
                    )}
                    <div className="text-primary-muted text-sm">
                      作成日:{" "}
                      {new Date(org.createdAt).toLocaleDateString("ja-JP")}
                    </div>
                  </div>
                  <Link
                    href={`/political-organizations/${org.id}`}
                    className="bg-primary-hover text-white no-underline text-sm px-4 py-2 rounded-lg hover:bg-primary-border transition-colors duration-200"
                  >
                    編集
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
