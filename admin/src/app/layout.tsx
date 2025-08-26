import type { Metadata } from "next";
import Sidebar from "@/client/components/Sidebar";
import { logout } from '@/server/auth/login';
import "./styles.css";

export const metadata: Metadata = {
  title: "政治資金ダッシュボード管理画面",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="container">
          <Sidebar logoutAction={logout} />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
