"use client";

import Link from "next/link";
import { useState } from "react";

interface PoliticalOrganizationFormData {
  name: string;
  slug: string;
  description: string;
}

interface PoliticalOrganizationFormProps {
  initialData?: Partial<PoliticalOrganizationFormData>;
  onSubmit: (data: PoliticalOrganizationFormData) => Promise<void>;
  submitButtonText: string;
  title: string;
  isLoading?: boolean;
  error?: string | null;
}

export function PoliticalOrganizationForm({
  initialData = { name: "", slug: "", description: "" },
  onSubmit,
  submitButtonText,
  title,
  isLoading = false,
  error = null,
}: PoliticalOrganizationFormProps) {
  const [formData, setFormData] = useState<PoliticalOrganizationFormData>({
    name: initialData.name || "",
    slug: initialData.slug || "",
    description: initialData.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;
    await onSubmit(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="card">
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/political-organizations"
          className="muted"
          style={{ textDecoration: "none" }}
        >
          ← 政治団体一覧に戻る
        </Link>
      </div>

      <h1>{title}</h1>

      {error && (
        <div
          style={{
            color: "#ff6b6b",
            marginBottom: "16px",
            padding: "12px",
            background: "#2d1b1b",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="name"
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            政治団体名 <span style={{ color: "#ff6b6b" }}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input"
            style={{ width: "100%", maxWidth: "500px" }}
            placeholder="政治団体名を入力してください"
            disabled={isLoading}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="slug"
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            スラッグ <span style={{ color: "#ff6b6b" }}>*</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="input"
            style={{ width: "100%", maxWidth: "500px" }}
            placeholder="team-mirai"
            disabled={isLoading}
            required
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label
            htmlFor="description"
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            説明（任意）
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="input"
            style={{
              width: "100%",
              maxWidth: "500px",
              minHeight: "100px",
              resize: "vertical",
            }}
            placeholder="政治団体の説明を入力してください"
            disabled={isLoading}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            className="button"
            disabled={isLoading || !formData.name.trim() || !formData.slug.trim()}
            style={{
              opacity: isLoading || !formData.name.trim() || !formData.slug.trim() ? 0.6 : 1,
              cursor:
                isLoading || !formData.name.trim() || !formData.slug.trim() ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "処理中..." : submitButtonText}
          </button>

          <Link
            href="/political-organizations"
            className="button"
            style={{
              background: "#374151",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
