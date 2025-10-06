import "server-only";
import Image from "next/image";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import { SOCIAL_LINKS } from "@/constants/social-links";

export default function AboutSection() {
  return (
    <MainColumnCard id="about">
      <div className="space-y-9">
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">
            チームみらいについて
          </h3>
          <p className="text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-700 font-medium sm:font-normal font-japanese">
            チームみらいは、AIエンジニアの安野たかひろが立ち上げた政党です。2025年参議院選挙にて、みなさまに多大なるご助力をいただき1議席を獲得し国政政党となりました。テクノロジーで政治の課題を解決することを目指して、既存の枠組みにとらわれることなく活動していきます。
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-0 sm:gap-1">
            {SOCIAL_LINKS.filter((social) => social.name !== "GitHub").map(
              (social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener"
                  className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2 hover:bg-gray-50 transition-colors rounded-lg p-2"
                  aria-label={social.name}
                >
                  <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full flex items-center justify-center relative">
                    <Image
                      src={`/images/social-icons/${social.icon}`}
                      alt={social.name}
                      width={56}
                      height={56}
                      className="sm:w-12 sm:h-12"
                    />
                  </div>
                  <div className="text-left hidden sm:block">
                    {social.subText ? (
                      <div className="flex items-baseline gap-1">
                        <div className="text-base font-bold text-black">
                          {social.mainText || social.name}
                        </div>
                        <div className="text-xs font-bold text-black opacity-80">
                          {social.subText}
                        </div>
                      </div>
                    ) : (
                      <div className="text-base font-bold text-black">
                        {social.mainText || social.name}
                      </div>
                    )}
                  </div>
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </MainColumnCard>
  );
}
