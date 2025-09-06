/**
 * SankeyノードIDをSafari対応のハッシュIDに変換するユーティリティ
 */

/**
 * 文字列をシンプルなハッシュに変換
 * Safari互換性のため、英数字のみを生成
 */
function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit整数に変換
  }
  return Math.abs(hash).toString(36);
}

/**
 * ノードIDを完全にSafari互換IDに変換
 * 英数字・ハイフン・アンダースコア以外の文字をハッシュに置換
 */
export function createSafariCompatibleId(originalId: string): string {
  return originalId.replace(/[^a-zA-Z0-9\-_]/g, (match) => {
    return `_${generateHash(match)}`;
  });
}
