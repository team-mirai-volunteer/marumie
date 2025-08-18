"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
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
    </aside>
  );
}
