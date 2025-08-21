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
    <div className="flex flex-col gap-2 w-full">
      {/* アイコン + タイトル + 更新時刻 */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2">
          {/* アイコン */}
          <div className="w-[30px] h-[30px] flex items-center justify-center">
            {icon}
          </div>

          {/* タイトル */}
          <Title className="text-[--color-text-primary]">{title}</Title>
        </div>

        {/* 更新時刻 */}
        <div className="flex-shrink-0">
          <Label className="text-[--color-text-muted]">{updatedAt}</Label>
        </div>
      </div>

      {/* サブタイトル */}
      <Subtitle className="text-[--color-text-secondary]">{subtitle}</Subtitle>
    </div>
  );
}
