"use client";
import "client-only";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";
import { Button } from "./ui";

export default function Sidebar({
  logoutAction,
}: {
  logoutAction: (formData: FormData) => Promise<void>;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user role when pathname changes (including after login)
  useEffect(() => {
    if (!isClient) return;

    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/users/me/role");
        if (response.ok) {
          const { role } = await response.json();
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [isClient, pathname]);

  const isActive = (path: string) => {
    if (!isClient) return false; // SSR時は常にfalse
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // logout handled via server action form below

  return (
    <aside className="bg-primary-panel p-4 flex flex-col h-full">
      <h2 className="text-primary-muted text-lg font-medium mb-3 mt-0">
        管理画面
      </h2>
      <nav className="flex flex-col gap-2">
        <Link
          href="/user-info"
          className={`text-white no-underline px-2.5 py-2 rounded-lg transition-colors duration-200 ${
            isActive("/user-info")
              ? "bg-primary-hover"
              : "hover:bg-primary-hover"
          }`}
        >
          User Info
        </Link>
        <Link
          href="/political-organizations"
          className={`text-white no-underline px-2.5 py-2 rounded-lg transition-colors duration-200 ${
            isActive("/political-organizations")
              ? "bg-primary-hover"
              : "hover:bg-primary-hover"
          }`}
        >
          政治団体
        </Link>
        <Link
          href="/transactions"
          className={`text-white no-underline px-2.5 py-2 rounded-lg transition-colors duration-200 ${
            isActive("/transactions")
              ? "bg-primary-hover"
              : "hover:bg-primary-hover"
          }`}
        >
          トランザクション
        </Link>
        <Link
          href="/upload-csv"
          className={`text-white no-underline px-2.5 py-2 rounded-lg transition-colors duration-200 ${
            isActive("/upload-csv")
              ? "bg-primary-hover"
              : "hover:bg-primary-hover"
          }`}
        >
          CSVアップロード
        </Link>
        {userRole === "admin" && (
          <Link
            href="/users"
            className={`text-white no-underline px-2.5 py-2 rounded-lg transition-colors duration-200 ${
              isActive("/users") ? "bg-primary-hover" : "hover:bg-primary-hover"
            }`}
          >
            ユーザー管理
          </Link>
        )}
      </nav>
      <div className="mt-auto pt-4">
        <form action={logoutAction}>
          <Button type="submit" variant="danger" fullWidth>
            ログアウト
          </Button>
        </form>
      </div>
    </aside>
  );
}
