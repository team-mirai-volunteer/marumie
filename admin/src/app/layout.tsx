import type { Metadata } from "next";
import Sidebar from "@/client/components/Sidebar";
import "./styles.css";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "政治資金ダッシュボード管理画面",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure Supabase cookies are initialized on layout load
  // (no-op call; helps set cookies in certain SSR flows)
  try {
    void createSupabaseServerClient();
  } catch {
    // ignore missing env during build
  }
  return (
    <html lang="ja">
      <body>
        <div className="container">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
