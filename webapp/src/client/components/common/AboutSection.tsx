import "server-only";
import Image from "next/image";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

const socialLinks = [
  {
    name: "Web",
    href: "https://team-mir.ai/",
    icon: "icon-web.svg",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@%E3%83%81%E3%83%BC%E3%83%A0%E3%81%BF%E3%82%89%E3%81%84%E5%85%AC%E5%BC%8F%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB/featured",
    icon: "icon-yt.svg",
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/team_mirai_jp",
    icon: "icon-x.svg",
  },
  {
    name: "LINE",
    href: "https://line.me/R/ti/p/@465hhyop?oat__id=5529589",
    icon: "icon-line.svg",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/annotakahiro2024/",
    icon: "icon-insta.svg",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/teammirai.official",
    icon: "icon-fb.svg",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@annotakahiro2024",
    icon: "icon-tiktok.svg",
  },
  {
    name: "GitHub",
    href: "https://github.com/team-mirai-volunteer",
    icon: "icon-github.svg",
  },
  {
    name: "Note",
    href: "https://note.com/annotakahiro24",
    icon: "icon-note.svg",
  },
];

export default function AboutSection() {
  return (
    <MainColumnCard>
      <div className="space-y-9">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            チームみらいについて
          </h3>
          <p className="text-[15px] leading-[1.87] tracking-[0.01em] text-gray-700 font-japanese">
            チームみらいは、AIエンジニアの安野たかひろが立ち上げた政党です。2025年参議院選挙にて1議席を獲得して国政政党となりました。テクノロジーで政治の課題を解決することを目指して、既存の枠組みにとらわれることなく活動していきます。
            テクノロジーで政治を変え、国民の皆さまとともに日本の未来をつくることを目指しています。
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener"
                className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity relative"
                aria-label={social.name}
              >
                <Image
                  src={`/images/social-icons/${social.icon}`}
                  alt={social.name}
                  fill
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </MainColumnCard>
  );
}
