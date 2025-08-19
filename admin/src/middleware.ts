import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  function toNextSameSite(value: CookieOptions["sameSite"]): "lax" | "strict" | "none" | undefined {
    return value === "lax" || value === "strict" || value === "none" ? value : undefined;
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        res.cookies.set({ name, value, domain: options?.domain, httpOnly: options?.httpOnly, maxAge: options?.maxAge, path: options?.path, sameSite: toNextSameSite(options?.sameSite), secure: options?.secure, expires: options?.expires });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({ name, value: "", domain: options?.domain, httpOnly: options?.httpOnly, maxAge: options?.maxAge, path: options?.path, sameSite: toNextSameSite(options?.sameSite), secure: options?.secure, expires: options?.expires });
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const isAuthPage = req.nextUrl.pathname.startsWith("/login");

  if (!user && !isAuthPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Admin-only paths
  if (user && req.nextUrl.pathname.startsWith("/admin")) {
    const readRole = (meta: unknown): string | undefined => {
      if (!meta || typeof meta !== "object") return undefined;
      const value = (meta as Record<string, unknown>)["role"];
      return typeof value === "string" ? value : undefined;
    };
    const role = readRole(user.app_metadata as unknown) ?? readRole(user.user_metadata as unknown);
    if (role !== "admin") {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/not-authorized";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};


