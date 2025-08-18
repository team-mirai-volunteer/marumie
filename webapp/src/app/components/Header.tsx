"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="px-4 md:px-10 py-4">
      <div className="flex justify-between items-center">
        {/* Logo and Title Section */}
        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-20 h-16 md:w-24 md:h-20 relative">
              {/* Team Mirai Logo */}
              <Image
                src="/team-mirai-logo.svg"
                alt="Team Mirai Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="flex items-end gap-4">
            <h1 className="text-xl md:text-2xl font-normal text-black" style={{ fontFamily: 'var(--font-inter)' }}>みらいオープンデータ</h1>
            <p className="text-xs md:text-sm text-black hidden sm:block" style={{ fontFamily: 'var(--font-noto-sans)' }}>チームみらいの政治資金をオープンに</p>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-6" style={{ fontFamily: 'var(--font-noto-sans)' }}>
          <Link
            href="/cash-flow"
            className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
          >
            収支の流れ
          </Link>
          <Link
            href="/annual-trends"
            className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
          >
            1年の推移
          </Link>
          <Link
            href="/donations"
            className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
          >
            寄付金額
          </Link>
          <Link
            href="/"
            className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
          >
            すべての出入金
          </Link>
          <Link
            href="/about-data"
            className="text-sm font-bold text-black hover:text-teal-600 transition-colors whitespace-nowrap"
          >
            データについて
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="メニューを開く"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-black mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-black mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
          <div className="flex flex-col space-y-3" style={{ fontFamily: 'var(--font-noto-sans)' }}>
            <Link
              href="/cash-flow"
              className="text-sm font-bold text-black hover:text-teal-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              収支の流れ
            </Link>
            <Link
              href="/annual-trends"
              className="text-sm font-bold text-black hover:text-teal-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              1年の推移
            </Link>
            <Link
              href="/donations"
              className="text-sm font-bold text-black hover:text-teal-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              寄付金額
            </Link>
            <Link
              href="/"
              className="text-sm font-bold text-black hover:text-teal-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              すべての出入金
            </Link>
            <Link
              href="/about-data"
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
