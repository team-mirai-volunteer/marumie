"use client";
import "client-only";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import type { PoliticalOrganization } from "@/shared/models/political-organization";
import type {
  ImportPortfolioCsvRequest,
  ImportPortfolioCsvResult,
} from "@/server/contexts/data-import/presentation/actions/import-portfolio-csv";
import { Input, Label } from "@/client/components/ui";
import { PoliticalOrganizationSelect } from "@/client/components/political-organizations/PoliticalOrganizationSelect";

interface PortfolioCsvImportClientProps {
  organizations: PoliticalOrganization[];
  importAction: (data: ImportPortfolioCsvRequest) => Promise<ImportPortfolioCsvResult>;
}

const FORMAT_EXAMPLE = `category,label,amount,snapshotDate
cash,現金・預金,1000000,2025-01-01
stocks,株式・有価証券,5000000,2025-01-01
precious_metals,貴金属,2000000,2025-01-01
real_estate,不動産,50000000,2025-01-01
other,その他,500000,2025-01-01`;

export default function PortfolioCsvImportClient({
  organizations,
  importAction,
}: PortfolioCsvImportClientProps) {
  const csvFileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [politicalOrganizationId, setPoliticalOrganizationId] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const importActionRef = useRef(importAction);

  useEffect(() => {
    if (organizations.length > 0 && !politicalOrganizationId) {
      setPoliticalOrganizationId(organizations[0].id);
    }
  }, [organizations, politicalOrganizationId]);

  useEffect(() => {
    importActionRef.current = importAction;
  }, [importAction]);

  const resetFileInput = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleImport = useCallback(async () => {
    if (!file || !politicalOrganizationId) {
      return;
    }

    setIsImporting(true);

    try {
      const csvContent = await file.text();
      const result = await importActionRef.current({
        csvContent,
        politicalOrganizationId,
      });

      if (result.ok) {
        toast.success(`${result.importedCount}件のインポートが完了しました`);
        resetFileInput();
      } else {
        toast.error(`インポートに失敗しました: ${result.error}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "インポートに失敗しました";
      toast.error(`インポートに失敗しました: ${errorMessage}`);
    } finally {
      setIsImporting(false);
    }
  }, [file, politicalOrganizationId, resetFileInput]);

  return (
    <div className="space-y-4">
      <div className="bg-card/50 rounded-lg p-4 space-y-1">
        <p className="text-sm font-semibold text-muted-foreground">CSVフォーマット</p>
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{FORMAT_EXAMPLE}</pre>
        <p className="text-xs text-muted-foreground mt-2">
          category: cash / stocks / precious_metals / real_estate / other
        </p>
      </div>

      <PoliticalOrganizationSelect
        organizations={organizations}
        value={politicalOrganizationId}
        onValueChange={setPoliticalOrganizationId}
        required
      />

      <div>
        <Label htmlFor={csvFileInputId}>CSV File:</Label>
        <Input
          ref={fileInputRef}
          id={csvFileInputId}
          className="h-10 border-0 bg-transparent shadow-none file:mr-4 file:h-full file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
      </div>

      {file && (
        <div className="bg-card/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">選択ファイル: {file.name}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleImport}
        disabled={!file || !politicalOrganizationId || isImporting}
        className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
      >
        {isImporting ? "インポート中..." : "インポート実行"}
      </button>
    </div>
  );
}
