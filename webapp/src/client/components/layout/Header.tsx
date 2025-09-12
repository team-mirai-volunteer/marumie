"use client";
import "client-only";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HamburgerMenuButton from "../ui/HamburgerMenuButton";

const navigationItems = [
  { href: "/", label: "トップ", desktopLabel: null },
  {
    href: "/#cash-flow",
    label: "チームみらいの収支の流れ",
    desktopLabel: "収支の流れ",
  },
  {
    href: "/#monthly-trends",
    label: "１年間の収支推移",
    desktopLabel: "1年間の推移",
  },
  {
    href: "/#donation-summary",
    label: "これまでの寄附金額",
    desktopLabel: "寄附金額",
  },
  {
    href: "/#transactions",
    label: "すべての出入金",
    desktopLabel: "すべての出入金",
  },
  {
    href: "/#explanation",
    label: "データについて",
    desktopLabel: "データについて",
  },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-2.5 py-3 xl:px-6 xl:py-4">
      {/* Main Header Container with rounded background */}
      <div className="bg-white rounded-[20px] px-3 py-3 xl:px-6 xl:py-0 relative z-10">
        <div className="flex justify-between items-center gap-2 xl:h-16">
          {/* Logo and Title Section */}
          <Link
            href="/"
            className="flex items-center gap-2 xl:gap-6 hover:opacity-80 transition-opacity cursor-pointer"
          >
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-8 xl:w-12 xl:h-11 relative">
                {/* Team Mirai Logo */}
                <Image
                  src="/logos/team-mirai-logo.svg"
                  alt="Team Mirai Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Title and Subtitle - Mobile: Vertical Stack, Desktop: Horizontal with baseline alignment */}
            <div className="flex flex-col gap-1.5 xl:flex-row xl:items-end xl:gap-2">
              <div className="h-[15px] xl:h-6 relative w-[160px] xl:w-[257px]">
                <Image
                  src="/logos/service-logo.svg"
                  alt="みらいオープンデータ"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="text-gray-800 leading-none text-[11px] xl:text-sm xl:font-normal">
                政治資金をまるごと公開
              </div>
            </div>
          </Link>

          {/* Desktop: Navigation Menu + Year Selector */}
          <div className="hidden lg:flex items-center gap-10">
            <nav
              className="flex items-center gap-6"
              aria-label="メインナビゲーション"
            >
              {navigationItems
                .filter((item) => item.desktopLabel)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {item.desktopLabel}
                  </Link>
                ))}
            </nav>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <HamburgerMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav
          className="lg:hidden -mt-14 pt-[92px] bg-gradient-to-br from-[#BCECDB] to-[#64D8C6] rounded-[30px] px-9 pb-15 transition-all duration-300 ease-in-out animate-in fade-in-0 slide-in-from-top-1 zoom-in-95"
          aria-label="モバイルナビゲーションメニュー"
        >
          <div className="flex flex-col">
            {navigationItems.map((item, index) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-3 px-1 hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-sm font-bold text-black">
                    {item.label}
                  </span>
                  <Image
                    src="/icons/icon-chevron-right.svg"
                    alt="右向き矢印"
                    width={24}
                    height={24}
                    className="text-black"
                  />
                </Link>
                {index < navigationItems.length - 1 && (
                  <div className="h-px bg-white mx-1" />
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
