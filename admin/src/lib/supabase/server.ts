import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  function toNextSameSite(value: CookieOptions["sameSite"]): "lax" | "strict" | "none" | undefined {
    return value === "lax" || value === "strict" || value === "none" ? value : undefined;
  }

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({
          name,
          value,
          domain: options?.domain,
          httpOnly: options?.httpOnly,
          maxAge: options?.maxAge,
          path: options?.path,
          sameSite: toNextSameSite(options?.sameSite),
          secure: options?.secure,
          expires: options?.expires,
        });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({
          name,
          value: "",
          domain: options?.domain,
          httpOnly: options?.httpOnly,
          maxAge: options?.maxAge,
          path: options?.path,
          sameSite: toNextSameSite(options?.sameSite),
          secure: options?.secure,
          expires: options?.expires,
        });
      },
    },
  });
}

export type UserRole = "admin" | "user";

export function getUserRoleFromMetadata(user: User | null): UserRole | null {
  if (!user) return null;

  const readRole = (meta: unknown): string | undefined => {
    if (!meta || typeof meta !== "object") return undefined;
    const value = (meta as Record<string, unknown>)["role"];
    return typeof value === "string" ? value : undefined;
  };

  const role = readRole(user.app_metadata as unknown) ?? readRole(user.user_metadata as unknown);
  if (role === "admin") return "admin";
  if (role === "user") return "user";
  return null;
}


