import "server-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import type { BalanceSheetData } from "@/types/balance-sheet";
import BalanceSheetChart from "./BalanceSheetChart";

interface BalanceSheetSectionProps {
  data?: BalanceSheetData;
}

export default function BalanceSheetSection({
  data,
}: BalanceSheetSectionProps) {
  return (
    <MainColumnCard id="balance-sheet">
      <CardHeader
        icon={
          <Image
            src="/icons/icon-heart-handshake.svg"
            alt="Balance sheet icon"
            width={30}
            height={30}
          />
        }
        title="現時点での貸借対照表"
        updatedAt="2025.8.14時点"
        subtitle="現在のチームみらいの財産と負債の状況"
      />

      {data ? (
        <BalanceSheetChart data={data} />
      ) : (
        <div className="flex justify-center items-center h-80 text-gray-500">
          データを読み込み中...
        </div>
      )}
    </MainColumnCard>
  );
}
