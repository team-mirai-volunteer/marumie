"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/client/api-client";
import { PoliticalOrganization } from "@/shared/model/political-organization";

export default function UploadCsvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [politicalOrganizationId, setPoliticalOrganizationId] =
    useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !politicalOrganizationId) return;
    setUploading(true);
    setMessage("");

    try {
      const result = await apiClient.uploadCsv({
        file,
        politicalOrganizationId,
      });

      setMessage(
        result.message ||
          `Successfully processed ${result.processedCount} records and saved ${result.savedCount} transactions`,
      );
    } catch (err) {
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
          <label htmlFor="politicalOrganizationId" className="label">
            Political Organization:
          </label>
          {loadingOrganizations ? (
            <div className="input" style={{ color: "#666" }}>
              Loading organizations...
            </div>
          ) : (
            <select
              id="politicalOrganizationId"
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
          <label htmlFor="csvFile" className="label">
            CSV File:
          </label>
          <input
            id="csvFile"
            className="input"
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />
        </div>
        <button
          className="button"
          disabled={
            !file ||
            !politicalOrganizationId ||
            uploading ||
            loadingOrganizations
          }
          type="submit"
        >
          {uploading ? "Processing…" : "Upload and Process"}
        </button>
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
