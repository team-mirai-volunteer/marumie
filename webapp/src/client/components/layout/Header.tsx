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
    label: "これまでの寄付金額",
    desktopLabel: "寄付金額",
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
    <header className="fixed top-0 left-0 right-0 z-40 px-2.5 py-3 lg:px-6 lg:py-4">
      {/* Main Header Container with rounded background */}
      <div className="bg-white rounded-[30px] lg:rounded-[100px] px-3 py-3 lg:px-6 lg:py-0 relative z-10">
        <div className="flex justify-between items-center gap-2 lg:h-16">
          {/* Logo and Title Section */}
          <Link
            href="/"
            className="flex items-center gap-2 lg:gap-4 hover:opacity-80 transition-opacity"
          >
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-8 lg:w-14 lg:h-12 relative">
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
            <div className="flex flex-col gap-1.5 lg:flex-row lg:items-end lg:gap-2">
              <div className="h-[15px] lg:h-6 relative w-[160px] lg:w-[257px]">
                <Image
                  src="/logos/mirai-open-data-title.png"
                  alt="みらいオープンデータ"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="text-gray-800 leading-none text-[11px] lg:text-sm">
                政治資金をまるごと公開
              </div>
            </div>
          </Link>

          {/* Desktop: Navigation Menu + Year Selector */}
          <div className="hidden lg:flex items-center gap-10">
            <nav className="flex items-center gap-6">
              {navigationItems
                .filter((item) => item.desktopLabel)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
                  >
                    {item.desktopLabel}
                  </Link>
                ))}
            </nav>

            {/* Desktop Year Selector */}
            <button
              type="button"
              className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-teal-200 to-green-200 rounded-full border border-gray-800 border-opacity-50"
            >
              <span className="text-sm font-medium text-gray-800">2025年</span>
              <Image
                src="/icons/icon-chevron-down.svg"
                alt="下向き矢印"
                width={12}
                height={12}
                className="text-gray-800"
              />
            </button>
          </div>

          {/* Mobile Year Selector and Menu */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Year Selector */}
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-teal-200 to-green-200 rounded-full border border-gray-800 border-opacity-50"
            >
              <span className="text-sm font-medium text-gray-800">2025年</span>
              <Image
                src="/icons/icon-chevron-down.svg"
                alt="下向き矢印"
                width={12}
                height={12}
                className="text-gray-800"
              />
            </button>

            {/* Mobile Menu Button */}
            <HamburgerMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden -mt-14 pt-[92px] bg-gradient-to-br from-[#BCECDB] to-[#64D8C6] rounded-[30px] px-9 pb-15 transition-all duration-300 ease-in-out animate-in fade-in-0 slide-in-from-top-1 zoom-in-95">
          <div className="flex flex-col">
            {navigationItems.map((item, index) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-3 px-1 hover:opacity-80 transition-opacity"
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
