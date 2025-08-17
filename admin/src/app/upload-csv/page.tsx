'use client';

import { useState } from 'react';

export default function UploadCsvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload-csv', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setMessage(`Uploaded: ${json.rows} rows detected`);
    } catch (err: any) {
      setMessage(err.message || String(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card">
      <h1>Upload CSV</h1>
      <form onSubmit={onSubmit} className="row">
        <input
          className="input"
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button className="button" disabled={!file || uploading}>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </form>
      {message && <p className="muted" style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
