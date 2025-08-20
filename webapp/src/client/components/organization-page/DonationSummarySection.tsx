"use client";
import "client-only";
import Image from "next/image";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import BaseCard from "@/client/components/ui/BaseCard";

export default function DonationSummarySection() {
  return (
    <MainColumnCard>
      <CardHeader
        icon={
          <Image
            src="/icons/icon-heart-handshake.svg"
            alt="Heart handshake icon"
            width={30}
            height={30}
          />
        }
        title="これまでの累計寄付金額"
        updatedAt="2025.8.14時点"
        subtitle="チームみらいにいただいた寄付金額と1ヶ月の推移"
      />

      {/* 寄付統計サマリー */}
      <div className="flex items-center gap-6">
        {/* 寄付金額カード */}
        <BaseCard className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#000000] font-bold text-base">寄付金額</div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-[#6B7280]">前日比</span>
              <Image
                src="/icons/icon-arrow-up.svg"
                alt="Arrow up icon"
                width={24}
                height={24}
              />
              <span className="text-[#238778] font-bold">8,000</span>
              <span className="text-[#6B7280]">円</span>
            </div>
          </div>
          <div className="flex items-end gap-1">
            <span
              className="font-bold text-[40px] leading-[30px]"
              style={{ color: "#000000" }}
            >
              1
            </span>
            <span className="font-bold text-base" style={{ color: "#000000" }}>
              億
            </span>
            <span
              className="font-bold text-[40px] leading-[30px]"
              style={{ color: "#000000" }}
            >
              7462
            </span>
            <span className="font-bold text-base" style={{ color: "#000000" }}>
              万
            </span>
            <span
              className="font-bold text-[40px] leading-[30px]"
              style={{ color: "#000000" }}
            >
              4000
            </span>
            <span className="font-bold text-base" style={{ color: "#000000" }}>
              円
            </span>
          </div>
        </BaseCard>

        {/* 寄付件数カード */}
        <BaseCard className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#000000] font-bold text-base">寄付件数</div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-[#6B7280]">前日比</span>
              <Image
                src="/icons/icon-arrow-up.svg"
                alt="Arrow up icon"
                width={24}
                height={24}
              />
              <span className="text-[#238778] font-bold">12</span>
              <span className="text-[#6B7280]">件</span>
            </div>
          </div>
          <div className="flex items-end gap-1">
            <span
              className="font-bold text-[40px] leading-[30px]"
              style={{ color: "#000000" }}
            >
              7118
            </span>
            <span className="font-bold text-base" style={{ color: "#000000" }}>
              件
            </span>
          </div>
        </BaseCard>

        {/* 企業団体献金カード */}
        <BaseCard className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#000000] font-bold text-base">
              企業団体献金
            </div>
          </div>
          <div className="flex items-end gap-1">
            <span
              className="font-bold text-[40px] leading-[30px]"
              style={{ color: "#000000" }}
            >
              0
            </span>
            <span className="font-bold text-base" style={{ color: "#000000" }}>
              件
            </span>
          </div>
        </BaseCard>
      </div>

      {/* プレースホルダーグラフ */}
      <div className="h-[287px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">寄付金額推移グラフ</div>
          <div className="text-sm">実装予定</div>
        </div>
      </div>

      {/* 寄付メッセージとボタン */}
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-[#000000] font-bold text-base mb-6">
          チームみらいは、皆さまのご支援・ご寄付のおかげで活動を続けられております。
        </p>
        <button
          type="button"
          className="bg-gradient-to-r from-[#BCECD3] to-[#64D8C6] border border-black rounded-[40px] px-6 py-2 text-[#000000] font-bold text-base hover:opacity-90 transition-opacity"
        >
          ご寄付はこちら
        </button>
      </div>
    </MainColumnCard>
  );
}
