"use client";

import Image from "next/image";
import Link from "next/link";

interface FloatingBackButtonProps {
  slug: string;
}

export default function FloatingBackButton({ slug }: FloatingBackButtonProps) {
  return (
    <Link
      href={`/o/${slug}`}
      className="fixed bottom-6 left-6 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white shadow-[2px_4px_10px_0px_rgba(144,144,144,0.25)] border-[0.5px] border-black md:hidden"
    >
      <Image
        src="/icons/icon-back-arrow.svg"
        alt="戻る"
        width={21}
        height={17}
        className="text-gray-600"
      />
    </Link>
  );
}
