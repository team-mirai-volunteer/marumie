import "server-only";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/contexts/auth/presentation/loaders/load-current-user";

/**
 * Route Handler 用の認証ガード。
 *
 * 未認証の場合は 401 の NextResponse を返すので、呼び出し側は
 * 返り値が非 null ならそのまま return すること。認証済みの場合は null を返す。
 *
 * proxy (middleware) の matcher はルーティング層のゲートに過ぎないため、
 * Route Handler 側でも明示的に認証を確認する。
 */
export async function requireAuthResponse(): Promise<NextResponse | null> {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  return null;
}
