import type { Metadata } from "next";
import Sidebar from "@/client/components/Sidebar";
import "./styles.css";

export const metadata: Metadata = {
  title: "Managing App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="container">
          <Sidebar />
          <main className="content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}


