import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Managing App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}


