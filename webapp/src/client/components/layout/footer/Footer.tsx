"use client";
import "client-only";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const getNavigationItems = (currentSlug: string) => [
  {
    href: `/o/${currentSlug}/#cash-flow`,
    label: "収支の流れ",
  },
  {
    href: `/o/${currentSlug}/#monthly-trends`,
    label: "1年の推移",
  },
  {
    href: `/o/${currentSlug}/#balance-sheet`,
    label: "貸借対照表",
  },
  {
    href: `/o/${currentSlug}/#transactions`,
    label: "すべての出入金",
  },
  {
    href: `/o/${currentSlug}/#explanation`,
    label: "データについて",
  },
];

export default function Footer() {
  const pathname = usePathname();

  // 現在のslugを取得（/o/[slug]/... の形式の場合、なければdefaultを使用）
  const currentSlug = pathname.startsWith("/o/")
    ? pathname.split("/")[2]
    : "team-mirai";

  const navigationItems = getNavigationItems(currentSlug);

  return (
    <footer className="w-full bg-gradient-to-tl from-[#BCECD3] to-[#64D8C6] px-4 md:px-[117px] pt-[72px] pb-[10px]">
      <div className="max-w-[1278px] mx-auto flex flex-col items-center gap-9">
        {/* Logo */}
        <div className="w-[150px] h-[127px] relative">
          <Image
            src="/logos/team-mirai-logo.svg"
            alt="Team Mirai Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-[275px] md:max-w-none">
          {/* Mobile: First row with 3 links */}
          <div className="flex flex-row justify-center gap-8 md:contents">
            {navigationItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-800 text-sm font-bold leading-[1.36em] hover:opacity-80 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Mobile: Second row with 2 links */}
          <div className="flex flex-row justify-center gap-8 md:contents">
            {navigationItems.slice(3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-800 text-sm font-bold leading-[1.36em] hover:opacity-80 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full text-center">
          <p className="text-gray-800 text-sm leading-[1.193359375em]">
            © 2025 Team Mirai
          </p>
        </div>
      </div>
    </footer>
  );
}
