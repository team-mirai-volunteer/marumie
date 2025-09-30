import "server-only";
import MainColumn from "@/client/components/layout/MainColumn";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

interface SectionTitleProps {
  children: React.ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 font-japanese">
      {children}
    </h2>
  );
}

interface SubSectionTitleProps {
  children: React.ReactNode;
}

function SubSectionTitle({ children }: SubSectionTitleProps) {
  return (
    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 font-japanese">
      {children}
    </h3>
  );
}

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

function Paragraph({ children, className = "" }: ParagraphProps) {
  return (
    <p
      className={`text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium sm:font-normal font-japanese ${className}`}
    >
      {children}
    </p>
  );
}

interface ListProps {
  items: string[];
}

function List({ items }: ListProps) {
  return (
    <ul className="list-disc list-inside text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium sm:font-normal font-japanese space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <MainColumn>
      <MainColumnCard>
        <div className="space-y-9">
          <div>
            <SectionTitle>利用規約</SectionTitle>
            <Paragraph className="mb-6">
              利用規約は10/1中に追加予定です。
            </Paragraph>

            <div className="space-y-6 hidden">
              <div>
                <SubSectionTitle>-</SubSectionTitle>
                <List items={["-"]} />
              </div>
            </div>
          </div>
        </div>
      </MainColumnCard>
    </MainColumn>
  );
}
