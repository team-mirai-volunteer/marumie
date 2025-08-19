import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

export async function POST() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  function toNextSameSite(value: CookieOptions["sameSite"]): "lax" | "strict" | "none" | undefined {
    return value === "lax" || value === "strict" || value === "none" ? value : undefined;
  }
  const supabase = createServerClient(url, anon, {
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
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}


