import type { Metadata } from "next";
import Sidebar from "@/client/components/Sidebar";
import "./styles.css";

export const metadata: Metadata = {
  title: "政治資金ダッシュボード管理画面",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // no-op
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
