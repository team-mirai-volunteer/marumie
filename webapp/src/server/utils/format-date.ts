/**
 * 日付を日本語形式でフォーマットする
 * @param dateString - フォーマットする日付文字列（nullの場合は空文字を返す）
 * @returns フォーマットされた日付文字列（例: "2025.1.15時点"）または空文字
 */
export function formatUpdatedAt(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}.${month}.${day}時点`;
}
