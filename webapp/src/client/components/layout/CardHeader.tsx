import { Label, Subtitle, Title } from "@/client/components/ui/Typography";

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
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full gap-2">
      {/* 左側：タイトル・サブタイトル */}
      <div className="flex flex-col gap-2">
        {/* アイコン + タイトル */}
        <div className="flex items-center gap-2">
          {/* アイコン */}
          <div className="w-[30px] h-[30px] flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <Title className="text-[--color-text-primary]">{title}</Title>
        </div>

        {/* サブタイトル */}
        <Subtitle className="text-[--color-text-secondary]">
          {subtitle}
        </Subtitle>
      </div>

      {/* 右側：更新時刻 - SPでは非表示 */}
      {updatedAt && (
        <div className="hidden sm:flex flex-shrink-0 self-end sm:self-start">
          <Label className="text-[--color-text-muted]">{updatedAt}</Label>
        </div>
      )}
    </div>
  );
}
