"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import {
  apiClient,
  type UpdatePoliticalOrganizationRequest,
} from "@/client/clients/api-client";
import { PoliticalOrganizationForm } from "@/client/components/political-organizations/PoliticalOrganizationForm";
import type { PoliticalOrganization } from "@/shared/models/political-organization";

interface EditPoliticalOrganizationPageProps {
  params: Promise<{ orgId: string }>;
}

export default function EditPoliticalOrganizationPage({
  params,
}: EditPoliticalOrganizationPageProps) {
  const { orgId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organization, setOrganization] =
    useState<PoliticalOrganization | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const data = await apiClient.getPoliticalOrganization(orgId);
        setOrganization(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes("404")) {
          setError("政治団体が見つかりません");
        } else {
          setError("政治団体の取得に失敗しました");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchOrganization();
  }, [orgId]);

  const handleSubmit = async (formData: {
    name: string;
    description: string;
  }) => {
    if (!formData.name.trim()) {
      setError("政治団体名は必須です");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData: UpdatePoliticalOrganizationRequest = {
        name: formData.name.trim(),
        ...(formData.description?.trim() && {
          description: formData.description.trim(),
        }),
      };

      await apiClient.updatePoliticalOrganization(orgId, requestData);

      router.push("/political-organizations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="card">
        <div className="text-center p-10">読み込み中...</div>
      </div>
    );
  }

  if (error && !organization) {
    return (
      <div className="card">
        <div className="text-red-500 text-center p-10">{error}</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="card">
        <div className="text-center p-10">政治団体が見つかりません</div>
      </div>
    );
  }

  return (
    <PoliticalOrganizationForm
      initialData={{
        name: organization.name,
        description: organization.description || "",
      }}
      onSubmit={handleSubmit}
      submitButtonText="更新"
      title={`「${organization.name}」を編集`}
      isLoading={loading}
      error={error}
    />
  );
}
