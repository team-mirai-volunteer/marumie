import "server-only";

import { getCurrentUser } from "@/server/contexts/auth/presentation/loaders/load-current-user";
import { AuthError } from "@/server/contexts/auth/domain/errors/auth-error";
import type { AuthUser } from "@/server/contexts/auth/domain/models/auth-user";

/**
 * 認証済みユーザーを取得する。未認証の場合は例外を投げる。
 *
 * proxy (middleware) による認証はルーティング層のゲートに過ぎず、
 * サーバーアクションや Route Handler はレイアウトのレンダリング前に実行されるため、
 * 副作用を伴う処理・データを返す処理では必ずこのガードを通すこと。
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthError("UNAUTHORIZED", "認証が必要です");
  }

  return user;
}
