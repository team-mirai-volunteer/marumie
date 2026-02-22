import "server-only";

import { loadPoliticalOrganizationsData } from "@/server/contexts/shared/presentation/loaders/load-political-organizations-data";
import { importPortfolioCsv } from "@/server/contexts/data-import/presentation/actions/import-portfolio-csv";
import PortfolioCsvImportClient from "@/client/components/portfolio-csv-import/PortfolioCsvImportClient";

export default async function ImportPortfolioPage() {
  const organizations = await loadPoliticalOrganizationsData();

  return (
    <div className="bg-card rounded-xl p-4">
      <h1 className="text-2xl font-bold text-white mb-6">ポートフォリオ資産インポート</h1>
      <PortfolioCsvImportClient organizations={organizations} importAction={importPortfolioCsv} />
    </div>
  );
}
