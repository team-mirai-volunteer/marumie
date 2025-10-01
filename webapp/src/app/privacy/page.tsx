import "server-only";
import LegalPageLayout, {
  Paragraph,
  SubSectionTitle,
  List,
} from "@/client/components/common/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="プライバシーポリシー">
      <Paragraph className="mb-6">
        プライバシーポリシーは10/1中に追加予定です。
      </Paragraph>

      <div className="space-y-6 hidden">
        <div>
          <SubSectionTitle>-</SubSectionTitle>
          <List items={["-"]} />
        </div>
      </div>
    </LegalPageLayout>
  );
}
