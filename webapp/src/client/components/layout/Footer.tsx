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

        {/* Legal Links */}
        <div className="flex flex-col items-center gap-0 w-[168px] h-[56px]">
          <Link
            href="/privacy-policy"
            className="text-black text-sm font-semibold leading-[2em] text-center hover:opacity-80 transition-opacity"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/terms"
            className="text-black text-sm font-semibold leading-[2em] text-center hover:opacity-80 transition-opacity"
          >
            特定商取引法に基づく表記
          </Link>
        </div>

        {/* Copyright */}
        <div className="w-full text-center">
          <p
            className="text-black text-sm leading-[1.193359375em]"
            style={{ fontFamily: "SF Pro, var(--font-geist-sans)" }}
          >
            © 2025 Team Mirai
          </p>
        </div>
      </div>
    </footer>
  );
}
