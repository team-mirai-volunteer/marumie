/**
 * 日付を日本語形式でフォーマットする
 * @param date - フォーマットする日付（nullの場合は空文字を返す）
 * @returns フォーマットされた日付文字列（例: "2025.1.15時点"）または空文字
 */
export function formatUpdatedAt(date: Date | null): string {
  if (!date) return "";
  const formatted = date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  return `${formatted.replace(/\//g, ".")}時点`;
}
