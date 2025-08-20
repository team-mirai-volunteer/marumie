import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/client/components/layout/Footer";
import Header from "@/client/components/layout/Header";

// Noto Sans JP for Japanese text with proper weights
const notoSansJP = Noto_Sans({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  style: ["normal"],
});

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
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
  preload: true,
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
      <head>
        {/* Google Fonts CDN for Noto Sans JP - Required for proper Japanese font weight rendering
            Next.js font optimization alone doesn't provide sufficient weight for Japanese characters */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} ${notoSansJP.variable} ${inter.variable} antialiased pt-24`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
