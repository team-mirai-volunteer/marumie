'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PoliticalOrganization } from '@/shared/model/political-organization';

export default function PoliticalOrganizationsPage() {
  const [organizations, setOrganizations] = useState<PoliticalOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/political-organizations');
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
          <div className="row">
            <h1>政治団体一覧</h1>
            <Link href="/political-organizations/new" className="button">
              新規作成
            </Link>
          </div>

          {loading && <p className="muted">読み込み中...</p>}

          {error && (
            <div style={{ color: '#ff6b6b', marginTop: '16px' }}>
              エラー: {error}
            </div>
          )}

          {!loading && !error && organizations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p className="muted">政治団体が登録されていません</p>
              <Link href="/political-organizations/new" className="button" style={{ marginTop: '16px' }}>
                最初の政治団体を作成
              </Link>
            </div>
          )}

          {!loading && !error && organizations.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                {organizations.map((org) => (
                  <div key={org.id} className="card" style={{ background: '#0f1527' }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>{org.name}</h3>
                    {org.description && (
                      <p className="muted" style={{ margin: '0 0 12px 0' }}>
                        {org.description}
                      </p>
                    )}
                    <div className="muted" style={{ fontSize: '14px' }}>
                      作成日: {new Date(org.createdAt).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
  );
}
