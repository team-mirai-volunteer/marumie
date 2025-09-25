import "server-only";
import Image from "next/image";
import Link from "next/link";

export default function PoliticalLeaderSection() {
  return (
    <div className="w-full md:flex md:justify-end">
      <Link
        href="/o/digimin"
        className="bg-white border border-black rounded-2xl md:rounded-3xl px-6 py-6 md:px-12 md:py-9 flex items-center gap-6 md:gap-24 hover:bg-gray-50 transition-colors w-full md:inline-flex"
      >
        <div className="text-[17px] md:text-[27px] font-bold text-gray-800 leading-[1.56] tracking-[0.01em] flex-1 md:flex-none">
          党首・安野貴博の政治団体の
          <br />
          「まる見え政治資金」も公開中
        </div>
        <div className="relative w-[37px] h-[37px]">
          <div className="w-full h-full border border-black rounded-full flex items-center justify-center">
            <Image
              src="/icons/icon-chevron-right-bold.svg"
              alt="詳細を見る"
              width={7}
              height={7}
              className="text-black"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
