"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { PoliticalOrganizationForm } from "@/client/components/PoliticalOrganizationForm";
import { PoliticalOrganization } from "@/shared/model/political-organization";
import {
  apiClient,
  UpdatePoliticalOrganizationRequest,
} from "@/client/clients/api-client";

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
        <div style={{ textAlign: "center", padding: "40px" }}>
          読み込み中...
        </div>
      </div>
    );
  }

  if (error && !organization) {
    return (
      <div className="card">
        <div style={{ color: "#ff6b6b", textAlign: "center", padding: "40px" }}>
          {error}
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="card">
        <div style={{ textAlign: "center", padding: "40px" }}>
          政治団体が見つかりません
        </div>
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
