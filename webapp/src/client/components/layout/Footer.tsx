import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-[#BCECD3] to-[#64D8C6] px-4 md:px-[117px] pt-[72px] pb-[10px]">
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
            <Link
              href="/#cash-flow"
              className="text-[#1F2937] text-sm font-bold leading-[1.36em] hover:opacity-80 transition-opacity"
            >
              収支の流れ
            </Link>
            <Link
              href="/#monthly-trends"
              className="text-[#1F2937] text-sm font-bold leading-[1.36em] hover:opacity-80 transition-opacity"
            >
              1年の推移
            </Link>
            <Link
              href="/#donation-summary"
              className="text-[#1F2937] text-sm font-bold leading-[1.36em] hover:opacity-80 transition-opacity"
            >
              寄付金額
            </Link>
          </div>
          {/* Mobile: Second row with 2 links */}
          <div className="flex flex-row justify-center gap-8 md:contents">
            <Link
              href="/#transactions"
              className="text-[#1F2937] text-sm font-bold leading-[1.36em] hover:opacity-80 transition-opacity"
            >
              すべての出入金
            </Link>
            <Link
              href="/#explanation"
              className="text-[#1F2937] text-sm font-bold leading-[1.36em] hover:opacity-80 transition-opacity"
            >
              データについて
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full text-center">
          <p className="text-[#1F2937] text-sm leading-[1.193359375em]">
            © 2025 Team Mirai
          </p>
        </div>
      </div>
    </footer>
  );
}
