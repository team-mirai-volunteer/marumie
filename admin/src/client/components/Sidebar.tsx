"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isActive = (path: string) => {
    if (!isClient) return false; // SSR時は常にfalse
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

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
      </nav>
      <div style={{ marginTop: "auto", padding: "16px 0" }}>
        <button
          onClick={handleLogout}
          className="button"
          style={{ width: "100%", background: "#ef4444", color: "white" }}
        >
          ログアウト
        </button>
      </div>
    </aside>
  );
}
