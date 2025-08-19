import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-key",
    );
  }

  const isServer = typeof window === "undefined";

  if (isServer) {
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        async getAll() {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },
        async setAll(cookiesToSet) {
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch (_error) {}
        },
      },
    });
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
