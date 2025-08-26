import { createClient } from "@/server/auth/client";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaUserRepository } from "@/server/repositories/prisma-user.repository";

const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);

export type { UserRole } from "@prisma/client";

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // First check database for role
  const dbUser = await userRepository.findByAuthId(user.id);
  if (dbUser) {
    return dbUser.role;
  }

  // Fallback to user_metadata if not in database
  return user.user_metadata?.role || "user";
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get or create user in database
  let dbUser = await userRepository.findByAuthId(user.id);
  
  if (!dbUser && user.email) {
    // Auto-create user with default role
    dbUser = await userRepository.create({
      authId: user.id,
      email: user.email,
      role: "user",
    });
  }

  return dbUser;
}

export async function requireRole(requiredRole: UserRole): Promise<boolean> {
  const currentRole = await getCurrentUserRole();

  if (!currentRole) return false;

  if (requiredRole === "admin") {
    return currentRole === "admin";
  }

  return true; // user role can access user-level features
}
