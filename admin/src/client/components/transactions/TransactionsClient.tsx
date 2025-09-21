"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TransactionRow } from "./TransactionRow";
import { StaticPagination } from "@/client/components/ui/StaticPagination";
import { DeleteAllButton } from "./DeleteAllButton";
import type { GetTransactionsResult } from "@/server/usecases/get-transactions-usecase";
import type { PoliticalOrganization } from "@/shared/models/political-organization";

interface TransactionsClientProps {
  organizations: PoliticalOrganization[];
}

export function TransactionsClient({ organizations }: TransactionsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<GetTransactionsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 50;

  useEffect(() => {
    const fetchTransactions = async (orgId: string = "") => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          perPage: perPage.toString(),
        });

        if (orgId) {
          params.set("orgIds", orgId);
        }

        const response = await fetch(`/api/transactions?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const result: GetTransactionsResult = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions(selectedOrgId);
  }, [currentPage, selectedOrgId]);

  const handleOrgFilterChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    // Reset to first page when filter changes
    if (currentPage > 1) {
      router.push("/transactions?page=1");
    }
  };

  if (loading) {
    return (
      <div className="bg-primary-panel rounded-xl p-4">
        <div className="flex justify-center items-center py-10">
          <p className="text-primary-muted">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-primary-panel rounded-xl p-4">
        <div className="flex justify-center items-center py-10">
          <p className="text-red-500">エラー: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-primary-panel rounded-xl p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-4">取引一覧</h1>

        {/* Organization Filter */}
        <div className="mb-4">
          <label
            htmlFor="org-filter"
            className="block text-sm font-medium text-white mb-2"
          >
            政治団体でフィルタ
          </label>
          <select
            id="org-filter"
            value={selectedOrgId}
            onChange={(e) => handleOrgFilterChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
          >
            <option value="">全件</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mt-5 mb-4">
        <p className="text-primary-muted">
          全 {data.total} 件中 {(data.page - 1) * data.perPage + 1} -{" "}
          {Math.min(data.page * data.perPage, data.total)} 件を表示
        </p>
        <DeleteAllButton
          disabled={data.total === 0}
          organizationId={selectedOrgId || undefined}
          onDeleted={() => {
            // データを再取得
            window.location.reload();
          }}
        />
      </div>

      {data.transactions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-primary-muted">
            トランザクションが登録されていません
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-primary-border">
                  <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                    取引日
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                    政治団体
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                    借方勘定科目
                  </th>
                  <th className="px-2 py-3 text-right text-sm font-semibold text-white">
                    借方金額
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                    貸方勘定科目
                  </th>
                  <th className="px-2 py-3 text-right text-sm font-semibold text-white">
                    貸方金額
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                    種別
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                    カテゴリ
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-white">
                    摘要{" "}
                    <span className="text-xs font-normal">
                      ※サービスには表示されません
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <StaticPagination
            currentPage={data.page}
            totalPages={data.totalPages}
            basePath="/transactions"
          />
        </>
      )}
    </div>
  );
}
