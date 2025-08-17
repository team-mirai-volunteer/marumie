'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PoliticalOrganizationForm } from '@/client/components/PoliticalOrganizationForm';
import { CreatePoliticalOrganizationRequest } from '@/shared/types/political-organization.types';
import { apiClient } from '@/client/api-client';

export default function NewPoliticalOrganizationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: { name: string; description: string }) => {
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

      await apiClient.createPoliticalOrganization(requestData);

      router.push('/political-organizations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PoliticalOrganizationForm
      onSubmit={handleSubmit}
      submitButtonText="作成"
      title="新しい政治団体を作成"
      isLoading={loading}
      error={error}
    />
  );
}
