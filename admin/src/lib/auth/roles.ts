import { createClient } from "@/lib/supabase/client";

export type UserRole = "admin" | "user";

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return user.user_metadata?.role || "user";
}

export async function requireRole(requiredRole: UserRole): Promise<boolean> {
  const currentRole = await getCurrentUserRole();

  if (!currentRole) return false;

  if (requiredRole === "admin") {
    return currentRole === "admin";
  }

  return true; // user role can access user-level features
}
