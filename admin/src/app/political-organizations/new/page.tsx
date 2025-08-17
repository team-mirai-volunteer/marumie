'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreatePoliticalOrganizationRequest } from '@/shared/model/political-organization';

export default function NewPoliticalOrganizationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreatePoliticalOrganizationRequest>({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('政治団体名は必須です');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData: CreatePoliticalOrganizationRequest = {
        name: formData.name.trim(),
        ...(formData.description?.trim() && { description: formData.description.trim() })
      };

      const response = await fetch('/api/political-organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create organization');
      }

      // Success - redirect to list page
      router.push('/political-organizations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="card">
          <div style={{ marginBottom: '20px' }}>
            <Link href="/political-organizations" className="muted" style={{ textDecoration: 'none' }}>
              ← 政治団体一覧に戻る
            </Link>
          </div>

          <h1>新しい政治団体を作成</h1>

          {error && (
            <div style={{ color: '#ff6b6b', marginBottom: '16px', padding: '12px', background: '#2d1b1b', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                政治団体名 <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                style={{ width: '100%', maxWidth: '500px' }}
                placeholder="政治団体名を入力してください"
                disabled={loading}
                required
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                説明（任意）
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input"
                style={{ width: '100%', maxWidth: '500px', minHeight: '100px', resize: 'vertical' }}
                placeholder="政治団体の説明を入力してください"
                disabled={loading}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                className="button"
                disabled={loading || !formData.name.trim()}
                style={{
                  opacity: loading || !formData.name.trim() ? 0.6 : 1,
                  cursor: loading || !formData.name.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '作成中...' : '作成'}
              </button>

              <Link
                href="/political-organizations"
                className="button"
                style={{
                  background: '#374151',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                キャンセル
              </Link>
            </div>
          </form>
        </div>
  );
}
