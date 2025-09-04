import { TransactionRow } from "@/client/components/transactions/TransactionRow";
import { StaticPagination } from "@/client/components/ui/StaticPagination";
import { DeleteAllButton } from "@/client/components/transactions/DeleteAllButton";
import { loadTransactionsData } from "@/server/loaders/load-transactions-data";

interface TransactionsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const perPage = 50;

  const data = await loadTransactionsData({
    page: currentPage,
    perPage,
  });

  return (
    <div className="bg-primary-panel rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">取引一覧</h1>
        <DeleteAllButton disabled={data.total === 0} />
      </div>

      <div className="mt-5 mb-4">
        <p className="text-primary-muted">
          全 {data.total} 件中 {(data.page - 1) * data.perPage + 1} -{" "}
          {Math.min(data.page * data.perPage, data.total)} 件を表示
        </p>
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
