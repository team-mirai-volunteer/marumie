"use client";
import "client-only";

import type { DisplayTransaction } from "@/types/display-transaction";

interface TransactionTableRowProps {
  transaction: DisplayTransaction;
}

export default function TransactionTableRow({
  transaction,
}: TransactionTableRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount);
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}.${month}.${day}`;
  };

  const getCategoryLabel = (transaction: DisplayTransaction) => {
    // Use subcategory if available, otherwise use category
    return transaction.subcategory || transaction.category;
  };

  const getCategoryColors = (category: string, subcategory?: string) => {
    // Special colors for donation category based on Figma design
    if (category === "寄付") {
      return {
        fontColor: "#1F2937",
        borderColor: "#E0F6C9",
        bgColor: "#E0F6C9",
      };
    }

    // Special colors for advertising expenses subcategory based on Figma design
    if (subcategory === "宣伝費") {
      return {
        fontColor: "#0369A1",
        borderColor: "#0369A1",
        bgColor: "#FFFFFF",
      };
    }

    // Special colors for election-related expenses subcategory based on Figma design
    if (subcategory === "選挙関係費") {
      return {
        fontColor: "#1F2937",
        borderColor: "#F5D0FE",
        bgColor: "#F5D0FE",
      };
    }

    // Return the same colors for all other categories initially
    return {
      fontColor: "#1F2937",
      borderColor: "#99F6E4",
      bgColor: "#99F6E4",
    };
  };

  const isIncome = transaction.transactionType === "income";
  const categoryColors = getCategoryColors(
    transaction.category,
    transaction.subcategory,
  );

  return (
    <div className="w-full">
      {/* Main row container */}
      <div className="flex items-end bg-white h-16 px-0 pr-4">
        {/* Date section - 140px width */}
        <div
          className="flex items-center justify-start px-4 h-full"
          style={{ width: "140px" }}
        >
          <span
            className="leading-4"
            style={{
              fontFamily:
                '"SF Pro Display", "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: 700,
              fontSize: "16px",
              color: "#1F2937",
            }}
          >
            {formatDate(transaction.date)}
          </span>
        </div>

        {/* Title section - flexible width */}
        <div className="flex items-center h-full flex-1">
          <span
            className="leading-7"
            style={{
              fontFamily: '"Noto Sans JP", "Noto Sans", sans-serif',
              fontWeight: 700,
              fontSize: "16px",
              color: "#1F2937",
            }}
          >
            {transaction.tags || transaction.category}
          </span>
        </div>

        {/* Amount section with plus/minus - 180px width */}
        <div
          className="flex items-center justify-end h-full pr-6"
          style={{ width: "180px" }}
        >
          <span
            className="leading-4 text-right"
            style={{
              fontFamily:
                '"SF Pro Display", "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: 700,
              fontSize: "20px",
              lineHeight: "1em",
              color: isIncome ? "#238778" : "#DC2626",
              letterSpacing: "1%",
            }}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(Math.abs(transaction.amount))}
          </span>
        </div>

        {/* Category label section - 160px width */}
        <div
          className="flex items-center h-full gap-2 pl-4"
          style={{ width: "160px" }}
        >
          <div className="flex justify-center items-center h-11">
            <div
              className="flex flex-col justify-center items-center gap-2 px-3 rounded-full border"
              style={{
                backgroundColor: categoryColors.bgColor,
                borderColor: categoryColors.borderColor,
                borderWidth: "1px",
              }}
            >
              <span
                className="font-medium text-xs leading-5 text-center"
                style={{
                  fontFamily: "Noto Sans JP",
                  lineHeight: "1.67em",
                  color: categoryColors.fontColor,
                }}
              >
                {getCategoryLabel(transaction)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border line */}
      <div className="w-full h-px" style={{ backgroundColor: "#D5DBE1" }}></div>
    </div>
  );
}
