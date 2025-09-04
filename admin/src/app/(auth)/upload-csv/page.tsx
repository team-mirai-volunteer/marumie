import "server-only";

import { getPoliticalOrganizations } from "@/server/actions/get-political-organizations";
import { uploadCsv } from "@/server/actions/upload-csv";
import { previewCsv } from "@/server/actions/preview-csv";
import CsvUploadClient from "@/client/components/csv-upload/CsvUploadClient";

export default async function UploadCsvPage() {
  const organizations = await getPoliticalOrganizations();

  return (
    <div className="bg-primary-panel rounded-xl p-4">
      <h1 className="text-2xl font-bold text-white mb-6">CSVアップロード</h1>
      <CsvUploadClient
        organizations={organizations}
        uploadAction={uploadCsv}
        previewAction={previewCsv}
      />
    </div>
  );
}
