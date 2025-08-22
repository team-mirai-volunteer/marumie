"use client";
import "client-only";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2.5 py-3 lg:px-6 lg:py-4">
      {/* Main Header Container with rounded background */}
      <div className="bg-white rounded-[30px] lg:rounded-[100px] px-3 py-3 lg:px-6 lg:py-0">
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
              <svg
                className="w-3 h-3 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
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
              <svg
                className="w-3 h-3 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="p-1 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="メニューを開く"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-4 h-0.5 bg-gray-800 transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
                  }`}
                ></span>
                <span
                  className={`block w-4 h-0.5 bg-gray-800 mt-1.5 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-4 h-0.5 bg-gray-800 mt-1.5 transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden mt-2 bg-white rounded-[30px] px-3 py-4">
          <div className="flex flex-col space-y-2">
            <Link
              href="/#cash-flow"
              className="text-sm font-bold text-black hover:text-teal-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              収支の流れ
            </Link>
            <Link
              href="/#monthly-trends"
              className="text-sm font-bold text-black hover:text-teal-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              1年間の推移
            </Link>
            <Link
              href="/#donation-summary"
              className="text-sm font-bold text-black hover:text-teal-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              寄付金額
            </Link>
            <Link
              href="/#transactions"
              className="text-sm font-bold text-black hover:text-teal-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              すべての出入金
            </Link>
            <Link
              href="/#explanation"
              className="text-sm font-bold text-black hover:text-teal-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              データについて
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
