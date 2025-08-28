"use client";
import "client-only";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";

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
    <aside className="sidebar">
      <h2>管理画面</h2>
      <nav className="nav">
        <Link
          href="/user-info"
          className={isActive("/user-info") ? "active" : ""}
        >
          User Info
        </Link>
        <Link
          href="/political-organizations"
          className={isActive("/political-organizations") ? "active" : ""}
        >
          政治団体
        </Link>
        <Link
          href="/transactions"
          className={isActive("/transactions") ? "active" : ""}
        >
          トランザクション
        </Link>
        <Link
          href="/upload-csv"
          className={isActive("/upload-csv") ? "active" : ""}
        >
          CSVアップロード
        </Link>
        {userRole === "admin" && (
          <Link href="/users" className={isActive("/users") ? "active" : ""}>
            ユーザー管理
          </Link>
        )}
      </nav>
      <div style={{ marginTop: "auto", padding: "16px 0" }}>
        <form action={logoutAction}>
          <button
            type="submit"
            className="button"
            style={{ width: "100%", background: "#ef4444", color: "white" }}
          >
            ログアウト
          </button>
        </form>
      </div>
    </aside>
  );
}
