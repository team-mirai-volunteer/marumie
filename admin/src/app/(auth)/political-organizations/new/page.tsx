"use client";
import "client-only";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  apiClient,
  type CreatePoliticalOrganizationRequest,
} from "@/client/lib/api-client";
import { PoliticalOrganizationForm } from "@/client/components/political-organizations/PoliticalOrganizationForm";

export default function NewPoliticalOrganizationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: {
    name: string;
    slug: string;
    description: string;
  }) => {
    if (!formData.name.trim()) {
      setError("政治団体名は必須です");
      return;
    }

    if (!formData.slug.trim()) {
      setError("スラッグは必須です");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData: CreatePoliticalOrganizationRequest = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        ...(formData.description?.trim() && {
          description: formData.description.trim(),
        }),
      };

      await apiClient.createPoliticalOrganization(requestData);

      router.push("/political-organizations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
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
