"use client";
import "client-only";

import type { DisplayTransaction } from "@/types/display-transaction";

interface TransactionTableRowProps {
  transaction: DisplayTransaction;
}

// Bank icon component (SVG from Figma)
const BankIcon = () => (
  <div className="relative w-7 h-7">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Bank Icon</title>
      <g transform="translate(3.5, 3.5)">
        <g>
          <rect x="3.15" y="8.4" width="2.1" height="7.35" fill="#000000"/>
          <rect x="9.45" y="8.4" width="2.1" height="7.35" fill="#000000"/>
          <rect x="0" y="17.85" width="21" height="2.1" fill="#000000"/>
          <rect x="15.75" y="8.4" width="2.1" height="7.35" fill="#000000"/>
          <rect x="0" y="0" width="21" height="6.3" fill="#000000"/>
        </g>
        <g transform="translate(17, 15.83)">
          <circle cx="5" cy="5" r="3.5" fill="#FFFFFF"/>
          <svg x="0" y="0" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <title>Star Icon</title>
            <path d="M5 0L6.545 3.455L10 5L6.545 6.545L5 10L3.455 6.545L0 5L3.455 3.455L5 0Z" fill="#30BCA7"/>
          </svg>
        </g>
      </g>
    </svg>
  </div>
);

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

  const getCategoryLabel = (category: string) => {
    // Map categories to Japanese labels
    const categoryMap: { [key: string]: string } = {
      "政党交付金": "交付金",
      "寄付": "寄付",
      "その他収入": "その他",
      // Add more mappings as needed
    };
    return categoryMap[category] || category;
  };

  const isIncome = transaction.transactionType === "income";

  return (
    <div className="w-full">
      {/* Main row container */}
      <div className="flex items-end bg-white h-16 px-0">
        {/* Date section - 140px width */}
        <div className="flex items-center justify-start px-4 h-full" style={{ width: '140px' }}>
          <span
            className="leading-4"
            style={{
              fontFamily: '"SF Pro Display", "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#1F2937'
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
              fontSize: '16px',
              color: '#1F2937'
            }}
          >
            {transaction.tags || transaction.category}
          </span>
        </div>

        {/* Amount section with plus/minus - 144px width (24px + 120px) */}
        <div className="flex items-center justify-end h-full" style={{ width: '144px' }}>
          <span
            className="leading-4 text-right"
            style={{
              fontFamily: '"SF Pro Display", "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '1em',
              color: isIncome ? '#238778' : '#DC2626',
              letterSpacing: '1%'
            }}
          >
            {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
          </span>
        </div>

        {/* Bank icon section - 88px width */}
        <div className="flex items-center justify-center h-full" style={{ width: '88px' }}>
          <BankIcon />
        </div>

        {/* Category label section - 160px width */}
        <div className="flex items-center h-full gap-2" style={{ width: '160px' }}>
          <div className="flex justify-center items-center h-11">
            <div className="flex flex-col justify-center items-center gap-2 px-3 rounded-full" style={{ backgroundColor: '#99F6E4' }}>
              <span className="text-gray-800 font-medium text-xs leading-5 text-center" style={{ fontFamily: 'Noto Sans JP', lineHeight: '1.67em' }}>
                {getCategoryLabel(transaction.category)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border line */}
      <div className="w-full h-px" style={{ backgroundColor: '#D5DBE1' }}></div>
    </div>
  );
}
