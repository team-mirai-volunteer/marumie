interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  updatedAt: string;
  subtitle: string;
}

export default function CardHeader({
  icon,
  title,
  updatedAt,
  subtitle,
}: CardHeaderProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* アイコン + タイトル + 更新時刻 */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2">
          {/* アイコン */}
          <div className="w-[30px] h-[30px] flex items-center justify-center">
            {icon}
          </div>

          {/* タイトル */}
          <h1
            className="text-[27px] font-bold leading-[1.52] tracking-[0.01em] text-black"
            style={{ fontFamily: "var(--font-noto-sans)" }}
          >
            {title}
          </h1>
        </div>

        {/* 更新時刻 */}
        <div className="flex-shrink-0">
          <span
            className="text-[11px] font-bold leading-[1.55] text-gray-500"
            style={{ fontFamily: "var(--font-noto-sans)" }}
          >
            {updatedAt}
          </span>
        </div>
      </div>

      {/* サブタイトル */}
      <p
        className="text-[14px] font-medium leading-[1.21] tracking-[0.01em] text-gray-400"
        style={{ fontFamily: "var(--font-noto-sans)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}
