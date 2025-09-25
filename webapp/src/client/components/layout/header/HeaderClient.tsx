"use client";
import "client-only";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OrganizationSelector from "./OrganizationSelector";
import type { OrganizationsResponse } from "@/types/organization";

const getNavigationItems = (currentSlug: string) => [
  { href: `/o/${currentSlug}/`, label: "トップ", desktopLabel: null },
  {
    href: `/o/${currentSlug}/#cash-flow`,
    label: "チームみらいの収支の流れ",
    desktopLabel: "収支の流れ",
  },
  {
    href: `/o/${currentSlug}/#monthly-trends`,
    label: "１年間の収支推移",
    desktopLabel: "1年間の推移",
  },
  {
    href: `/o/${currentSlug}/#balance-sheet`,
    label: "貸借対照表",
    desktopLabel: "貸借対照表",
  },
  {
    href: `/o/${currentSlug}/#transactions`,
    label: "すべての出入金",
    desktopLabel: "すべての出入金",
  },
  {
    href: `/o/${currentSlug}/#explanation`,
    label: "データについて",
    desktopLabel: "データについて",
  },
];

interface HeaderClientProps {
  organizations: OrganizationsResponse;
}

export default function HeaderClient({ organizations }: HeaderClientProps) {
  const pathname = usePathname();

  // 現在のslugを取得（/o/[slug]/... の形式の場合、なければdefaultを使用）
  const currentSlug = pathname.startsWith("/o/")
    ? pathname.split("/")[2]
    : organizations.default;
  const logoHref = `/o/${organizations.default}/`;
  const navigationItems = getNavigationItems(currentSlug);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-2.5 py-3 xl:px-6 xl:py-4">
      {/* Main Header Container with rounded background */}
      <div className="bg-white rounded-[20px] px-3 py-3 xl:px-6 xl:py-0 relative z-10">
        <div className="flex justify-between items-center gap-2 xl:h-16">
          {/* Logo and Title Section */}
          <Link
            href={logoHref}
            className="flex items-center gap-2 xl:gap-6 hover:opacity-80 transition-opacity cursor-pointer"
          >
            {/* Logo */}
            <div className="hidden lg:flex items-center">
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
            <div className="flex flex-col gap-1.5 2xl:flex-row 2xl:items-end 2xl:gap-2">
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
                政治とカネ、隠さず公開します
              </div>
            </div>
          </Link>

          {/* Desktop: Navigation Menu + Organization Selector */}
          <div className="hidden lg:flex items-center gap-8">
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
            <OrganizationSelector
              organizations={organizations}
              currentSlug={currentSlug}
            />
          </div>

          {/* Mobile: Organization Selector */}
          <div className="lg:hidden flex items-center">
            <OrganizationSelector
              organizations={organizations}
              currentSlug={currentSlug}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
