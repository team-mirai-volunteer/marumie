import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/client/components/layout/Footer";
import Header from "@/client/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Note: FOT-TsukuGo Pro is a commercial font that would need to be loaded separately
// For now, we'll use Inter as a fallback in the header component

export const metadata: Metadata = {
  title: "Mirai Open Data - チームみらいの政治資金をオープンに",
  description:
    "チームみらいの政治資金の流れを透明性を持って公開するプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} ${inter.variable} antialiased pt-24`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
