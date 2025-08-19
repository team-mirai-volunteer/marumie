import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

// Admin-only: invite a user by email and assign role metadata
export async function POST(request: Request) {
  const { email, role } = await request.json().catch(() => ({} as { email?: string; role?: string }));
  if (!email || !role) {
    return NextResponse.json({ error: "email and role are required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const url = process.env.SUPABASE_URL as string;
  const anon = process.env.SUPABASE_ANON_KEY as string;

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

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const readRole = (meta: unknown): string | undefined => {
    if (!meta || typeof meta !== "object") return undefined;
    const value = (meta as Record<string, unknown>)["role"];
    return typeof value === "string" ? value : undefined;
  };
  const currentRole = readRole(user.app_metadata as unknown) ?? readRole(user.user_metadata as unknown);
  if (currentRole !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Use Supabase admin API via service key to invite user
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const projectUrl = process.env.SUPABASE_URL;
  if (!serviceKey || !projectUrl) {
    return NextResponse.json({ error: "Missing server env" }, { status: 500 });
  }

  const resp = await fetch(`${projectUrl}/auth/v1/invite`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, data: { role } }),
  });

  if (!resp.ok) {
    const j = await resp.json().catch(() => ({}));
    return NextResponse.json({ error: j.error_description || j.message || "Invite failed" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}


