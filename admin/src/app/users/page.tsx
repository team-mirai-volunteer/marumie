import 'server-only';
import { requireRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "@/server/repositories/prisma-user.repository";
import UserManagement from "@/client/components/UserManagement";

const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);

export default async function UsersPage() {
  const hasAccess = await requireRole("admin");
  
  if (!hasAccess) {
    redirect("/login");
  }

  const users = await userRepository.findAll();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserManagement users={users} />
    </div>
  );
}