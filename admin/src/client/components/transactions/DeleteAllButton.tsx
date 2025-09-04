"use client";

import { useState } from "react";
import { deleteAllTransactionsAction } from "@/server/actions/delete-all-transactions";

interface DeleteAllButtonProps {
  disabled?: boolean;
}

export function DeleteAllButton({ disabled = false }: DeleteAllButtonProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAll = async () => {
    if (
      !window.confirm(
        "すべてのトランザクションを削除してもよろしいですか？この操作は取り消せません。",
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      const result = await deleteAllTransactionsAction();

      if (result.success) {
        alert(`${result.deletedCount}件のトランザクションを削除しました。`);
      } else {
        alert(`エラー: ${result.error}`);
      }
    } catch (err) {
      alert(`エラー: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeleteAll}
      disabled={deleting || disabled}
      className={`bg-red-600 text-white border-0 rounded-lg px-4 py-2.5 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ${
        deleting || disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-red-700 cursor-pointer"
      }`}
    >
      {deleting ? "削除中..." : "全件削除"}
    </button>
  );
}
