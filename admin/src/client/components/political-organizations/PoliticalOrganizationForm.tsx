"use client";
import "client-only";

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
}

export function PoliticalOrganizationForm({
  initialData = { name: "", slug: "", description: "" },
  onSubmit,
  submitButtonText,
  title,
}: PoliticalOrganizationFormProps) {
  const [formData, setFormData] = useState<PoliticalOrganizationFormData>({
    name: initialData.name || "",
    slug: initialData.slug || "",
    description: initialData.description || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
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
    <div className="bg-primary-panel rounded-xl p-4">
      <div className="mb-5">
        <Link
          href="/political-organizations"
          className="text-primary-muted no-underline hover:text-white transition-colors"
        >
          ← 政治団体一覧に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>

      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-900/20 rounded-lg border border-red-900/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div>
          <label htmlFor="name" className="block mb-2 font-medium text-white">
            政治団体名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-primary-input text-white border border-primary-border rounded-lg px-3 py-2.5 w-full max-w-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
            placeholder="政治団体名を入力してください"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block mb-2 font-medium text-white">
            スラッグ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="bg-primary-input text-white border border-primary-border rounded-lg px-3 py-2.5 w-full max-w-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
            placeholder="team-mirai"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-2 font-medium text-white"
          >
            説明（任意）
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="bg-primary-input text-white border border-primary-border rounded-lg px-3 py-2.5 w-full max-w-md min-h-24 resize-y transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
            placeholder="政治団体の説明を入力してください"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={
              isLoading || !formData.name.trim() || !formData.slug.trim()
            }
            className={`bg-primary-accent text-white border-0 rounded-lg px-4 py-2.5 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent ${
              isLoading || !formData.name.trim() || !formData.slug.trim()
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-blue-600 cursor-pointer"
            }`}
          >
            {isLoading ? "処理中..." : submitButtonText}
          </button>

          <Link
            href="/political-organizations"
            className="bg-primary-hover text-white border border-primary-border hover:bg-primary-border no-underline inline-block rounded-lg px-4 py-2.5 font-medium transition-colors duration-200"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
