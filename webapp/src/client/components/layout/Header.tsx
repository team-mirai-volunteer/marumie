"use client";
import "client-only";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HamburgerMenuButton from "../ui/HamburgerMenuButton";

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
              <Link
                href="/#cash-flow"
                className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
              >
                収支の流れ
              </Link>
              <Link
                href="/#monthly-trends"
                className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
              >
                1年間の推移
              </Link>
              <Link
                href="/#donation-summary"
                className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
              >
                寄付金額
              </Link>
              <Link
                href="/#transactions"
                className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
              >
                すべての出入金
              </Link>
              <Link
                href="/#explanation"
                className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
              >
                データについて
              </Link>
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
            {/* トップ */}
            <Link
              href="/"
              className="flex items-center justify-between py-3 px-1 hover:opacity-80 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-sm font-bold text-black">トップ</span>
              <Image
                src="/icons/icon-chevron-right.svg"
                alt="右向き矢印"
                width={24}
                height={24}
                className="text-black"
              />
            </Link>

            {/* 区切り線 */}
            <div className="h-px bg-white mx-1" />

            {/* チームみらいの収支の流れ */}
            <Link
              href="/#cash-flow"
              className="flex items-center justify-between py-3 px-1 hover:opacity-80 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-sm font-bold text-black">
                チームみらいの収支の流れ
              </span>
              <Image
                src="/icons/icon-chevron-right.svg"
                alt="右向き矢印"
                width={24}
                height={24}
                className="text-black"
              />
            </Link>

            {/* 区切り線 */}
            <div className="h-px bg-white mx-1" />

            {/* １年間の収支推移 */}
            <Link
              href="/#monthly-trends"
              className="flex items-center justify-between py-3 px-1 hover:opacity-80 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-sm font-bold text-black">
                １年間の収支推移
              </span>
              <Image
                src="/icons/icon-chevron-right.svg"
                alt="右向き矢印"
                width={24}
                height={24}
                className="text-black"
              />
            </Link>

            {/* 区切り線 */}
            <div className="h-px bg-white mx-1" />

            {/* これまでの寄付金額 */}
            <Link
              href="/#donation-summary"
              className="flex items-center justify-between py-3 px-1 hover:opacity-80 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-sm font-bold text-black">
                これまでの寄付金額
              </span>
              <Image
                src="/icons/icon-chevron-right.svg"
                alt="右向き矢印"
                width={24}
                height={24}
                className="text-black"
              />
            </Link>

            {/* 区切り線 */}
            <div className="h-px bg-white mx-1" />

            {/* すべての出入金 */}
            <Link
              href="/#transactions"
              className="flex items-center justify-between py-3 px-1 hover:opacity-80 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-sm font-bold text-black">
                すべての出入金
              </span>
              <Image
                src="/icons/icon-chevron-right.svg"
                alt="右向き矢印"
                width={24}
                height={24}
                className="text-black"
              />
            </Link>

            {/* 区切り線 */}
            <div className="h-px bg-white mx-1" />

            {/* データについて */}
            <Link
              href="/#explanation"
              className="flex items-center justify-between py-3 px-1 hover:opacity-80 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-sm font-bold text-black">
                データについて
              </span>
              <Image
                src="/icons/icon-chevron-right.svg"
                alt="右向き矢印"
                width={24}
                height={24}
                className="text-black"
              />
            </Link>

            {/* 区切り線 */}
            <div className="h-px bg-white mx-1" />
          </div>
        </nav>
      )}
    </header>
  );
}
