"use client";
import "client-only";

import { useId, useState } from "react";
import type { PoliticalOrganization } from "@/shared/models/political-organization";
import { PoliticalOrganizationSelector } from "@/client/components/ui";
import CsvPreview from "@/client/components/csv-import/CsvPreview";
import type { PreviewMfCsvResult } from "@/server/usecases/preview-mf-csv-usecase";
import type {
  UploadCsvRequest,
  UploadCsvResponse,
} from "@/server/actions/upload-csv";
import type { PreviewCsvRequest } from "@/server/actions/preview-csv";

interface CsvUploadClientProps {
  organizations: PoliticalOrganization[];
  uploadAction: (data: UploadCsvRequest) => Promise<UploadCsvResponse>;
  previewAction: (data: PreviewCsvRequest) => Promise<PreviewMfCsvResult>;
}

export default function CsvUploadClient({
  organizations,
  uploadAction,
  previewAction,
}: CsvUploadClientProps) {
  const csvFileInputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [politicalOrganizationId, setPoliticalOrganizationId] =
    useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [previewResult, setPreviewResult] = useState<PreviewMfCsvResult | null>(
    null,
  );

  const handlePreviewComplete = (result: PreviewMfCsvResult) => {
    setPreviewResult(result);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !politicalOrganizationId) return;
    setUploading(true);
    setMessage("");

    try {
      if (!previewResult) {
        setMessage("Error: Preview data not available");
        return;
      }

      const validTransactions = previewResult.transactions.filter(
        (t) => t.status === "valid",
      );
      if (validTransactions.length === 0) {
        setMessage("有効なデータがありません");
        return;
      }

      const result = await uploadAction({
        validTransactions,
        politicalOrganizationId,
      });

      setMessage(
        result.message ||
          `Successfully processed ${result.processedCount} records and saved ${result.savedCount} transactions`,
      );

      setFile(null);
      setPreviewResult(null);

      const fileInput = document.getElementById(
        csvFileInputId,
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <PoliticalOrganizationSelector
          organizations={organizations}
          value={politicalOrganizationId}
          onChange={setPoliticalOrganizationId}
          label="Political Organization"
          autoSelectFirst={true}
        />
      </div>
      <div>
        <label
          htmlFor={csvFileInputId}
          className="block text-sm font-medium text-white mb-2"
        >
          CSV File:
        </label>
        <input
          id={csvFileInputId}
          className="bg-primary-input text-white border border-primary-border rounded-lg px-3 py-2.5 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-accent file:text-white hover:file:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
      </div>

      <CsvPreview
        file={file}
        politicalOrganizationId={politicalOrganizationId}
        onPreviewComplete={handlePreviewComplete}
        previewAction={previewAction}
      />

      {(() => {
        const isDisabled =
          !file ||
          !politicalOrganizationId ||
          !previewResult ||
          previewResult.summary.validCount === 0 ||
          uploading;

        return (
          <button
            disabled={isDisabled}
            type="submit"
            className={`bg-primary-accent text-white border-0 rounded-lg px-4 py-2.5 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent ${
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600 cursor-pointer"
            }`}
          >
            {uploading ? "Processing…" : "このデータを保存する"}
          </button>
        );
      })()}

      {message && (
        <div
          className={`mt-3 p-3 rounded border ${
            message.startsWith("Error:")
              ? "text-red-500 bg-red-900/20 border-red-900/30"
              : "text-green-500 bg-green-900/20 border-green-900/30"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
