import "server-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import BalanceSheetChart from "./BalanceSheetChart";

export default function BalanceSheetSection() {
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

      <BalanceSheetChart />
    </MainColumnCard>
  );
}
