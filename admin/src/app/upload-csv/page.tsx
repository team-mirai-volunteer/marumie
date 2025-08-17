'use client';

import { useState } from 'react';

export default function UploadCsvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [politicalOrganizationId, setPoliticalOrganizationId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !politicalOrganizationId) return;
    setUploading(true);
    setMessage('');
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('politicalOrganizationId', politicalOrganizationId);
      const res = await fetch('/api/upload-csv', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) {
        const errorMsg = json.error || 'Upload failed';
        const details = json.details ? ` Details: ${Array.isArray(json.details) ? json.details.join(', ') : json.details}` : '';
        throw new Error(errorMsg + details);
      }
      setMessage(json.message || `Successfully processed ${json.processedCount} records and saved ${json.savedCount} transactions`);
    } catch (err: any) {
      setMessage(`Error: ${err.message || String(err)}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card">
      <h1>Upload Money Forward CSV</h1>
      <form onSubmit={onSubmit} className="column" style={{ gap: 12 }}>
        <div>
          <label htmlFor="politicalOrganizationId" className="label">
            Political Organization ID:
          </label>
          <input
            id="politicalOrganizationId"
            className="input"
            type="text"
            placeholder="Enter political organization ID"
            value={politicalOrganizationId}
            onChange={(e) => setPoliticalOrganizationId(e.target.value)}
            required
          />
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
          disabled={!file || !politicalOrganizationId || uploading}
          type="submit"
        >
          {uploading ? 'Processing…' : 'Upload and Process'}
        </button>
      </form>
      {message && (
        <div 
          className="muted" 
          style={{ 
            marginTop: 12, 
            padding: 12, 
            backgroundColor: message.startsWith('Error:') ? '#ffebee' : '#e8f5e8',
            borderRadius: 4 
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
