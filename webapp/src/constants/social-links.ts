export const DEFAULT_ID = "annotakahiro2024";

interface SocialLinks {
  name: string;
  href: string;
  mainText?: string;
  subText?: string;
  icon: string;
}

export const SOCIAL_LINKS: SocialLinks[] = [
  {
    name: "webサイト",
    href: "https://team-mir.ai/",
    icon: "icon-web.svg",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@%E3%83%81%E3%83%BC%E3%83%A0%E3%81%BF%E3%82%89%E3%81%84%E5%85%AC%E5%BC%8F%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB/featured",
    icon: "icon-yt.svg",
  },
  {
    name: "LINE",
    href: "https://line.me/R/ti/p/@465hhyop?oat__id=5529589",
    icon: "icon-line.svg",
  },
  {
    name: "X",
    mainText: "X",
    subText: "（旧Twitter）",
    href: "https://x.com/team_mirai_jp",
    icon: "icon-x.svg",
  },
  {
    name: "Instagram",
    href: `https://www.instagram.com/${DEFAULT_ID}/`,
    icon: "icon-insta.svg",
  },
  {
    name: "Threads",
    href: `https://www.threads.com/@${DEFAULT_ID}/`,
    icon: "icon-threads.svg",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/teammirai.official",
    icon: "icon-fb.svg",
  },
  {
    name: "TikTok",
    href: `https://www.tiktok.com/@${DEFAULT_ID}/`,
    icon: "icon-tiktok.svg",
  },
  {
    name: "GitHub",
    href: "https://github.com/team-mirai-volunteer/marumie",
    icon: "icon-github.svg",
  },
];
