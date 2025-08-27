"use client";

import { useEffect, useId, useState } from "react";
import { apiClient } from "@/client/clients/api-client";
import type { PoliticalOrganization } from "@/shared/models/political-organization";
import CsvPreview from "@/client/components/CsvPreview";
import type { PreviewMfCsvResult } from "@/server/usecases/preview-mf-csv-usecase";

export default function UploadCsvPage() {
  const politicalOrgSelectId = useId();
  const csvFileInputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [politicalOrganizationId, setPoliticalOrganizationId] =
    useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [previewResult, setPreviewResult] = useState<PreviewMfCsvResult | null>(null);
  const [organizations, setOrganizations] = useState<PoliticalOrganization[]>(
    [],
  );
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const data = await apiClient.listPoliticalOrganizations();
        setOrganizations(data);
        // 最初の政治団体を自動選択
        if (data.length > 0) {
          setPoliticalOrganizationId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setMessage("Error loading political organizations");
      } finally {
        setLoadingOrganizations(false);
      }
    }

    fetchOrganizations();
  }, []);

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

      const validTransactions = previewResult.transactions.filter(t => t.status === 'valid');
      if (validTransactions.length === 0) {
        setMessage("有効なデータがありません");
        return;
      }

      const result = await apiClient.uploadCsv({
        validTransactions,
        politicalOrganizationId,
      });

      setMessage(
        result.message ||
          `Successfully processed ${result.processedCount} records and saved ${result.savedCount} transactions`,
      );

      setFile(null);
      setPreviewResult(null);

      const fileInput = document.getElementById(csvFileInputId) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card">
      <h1>CSVアップロード</h1>
      <form onSubmit={onSubmit} className="column" style={{ gap: 12 }}>
        <div>
          <label htmlFor={politicalOrgSelectId} className="label">
            Political Organization:
          </label>
          {loadingOrganizations ? (
            <div className="input" style={{ color: "#666" }}>
              Loading organizations...
            </div>
          ) : (
            <select
              id={politicalOrgSelectId}
              className="input"
              value={politicalOrganizationId}
              onChange={(e) => setPoliticalOrganizationId(e.target.value)}
              required
            >
              {organizations.length === 0 && (
                <option value="">No political organizations found</option>
              )}
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label htmlFor={csvFileInputId} className="label">
            CSV File:
          </label>
          <input
            id={csvFileInputId}
            className="input"
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
        />

        {(() => {
          const isDisabled = !file ||
            !politicalOrganizationId ||
            !previewResult ||
            previewResult.summary.validCount === 0 ||
            uploading ||
            loadingOrganizations;

          return (
            <button
              className="button"
              disabled={isDisabled}
              type="submit"
              style={{
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? "Processing…" : "このデータを保存する"}
            </button>
          );
        })()}
      </form>
      {message && (
        <div
          className="muted"
          style={{
            marginTop: 12,
            padding: 12,
            backgroundColor: message.startsWith("Error:")
              ? "#ffebee"
              : "#e8f5e8",
            borderRadius: 4,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
