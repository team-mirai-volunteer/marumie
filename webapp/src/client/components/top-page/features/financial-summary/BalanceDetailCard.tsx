interface BalanceDetailCardProps {
  className?: string;
  balance: number;
  cashBalance: number;
  unpaidExpense: number;
}

interface BalanceItem {
  label: string;
  amount: number;
  unit: string;
}

export default function BalanceDetailCard({
  className,
  balance,
  cashBalance,
  unpaidExpense,
}: BalanceDetailCardProps) {
  // 金額を万円単位に変換
  const formatToManYen = (value: number): number => {
    return Math.round(value / 10000);
  };

  const mainBalance = {
    title: "収支",
    amount: formatToManYen(balance),
    unit: "万円",
  };

  const balanceItems: BalanceItem[] = [
    {
      label: "現金残高",
      amount: formatToManYen(cashBalance),
      unit: "万円",
    },
  ];

  // 未払費用が0より大きい場合のみ追加
  if (unpaidExpense > 0) {
    balanceItems.push({
      label: "未払費用",
      amount: -formatToManYen(unpaidExpense),
      unit: "万円",
    });
  }

  const formatAmount = (amount: number): string => {
    if (amount >= 0) {
      return `+${amount.toLocaleString()}`;
    }
    return amount.toLocaleString();
  };

  return (
    <div
      className={`border border-gray-200 rounded-2xl p-5 sm:p-6 ${className}`}
    >
      {/* デスクトップ版レイアウト */}
      <div className="hidden sm:flex flex-row items-end gap-4">
        {/* メイン収支セクション */}
        <div className="flex flex-col justify-center gap-4">
          <div className="text-gray-800 font-bold text-base leading-7">
            {mainBalance.title}
          </div>
          <div className="flex flex-row items-end gap-1">
            <div className="text-gray-800 font-bold text-4xl leading-7 tracking-wide font-sf-pro">
              {mainBalance.amount}
            </div>
            <div className="text-gray-500 font-bold text-base leading-4">
              {mainBalance.unit}
            </div>
          </div>
        </div>

        {/* 縦線 */}
        <div className="w-0 h-9 border-l border-gray-200"></div>

        {/* 詳細セクション */}
        <div className="flex flex-col justify-center gap-2">
          {balanceItems.map((item, index) => (
            <div key={index} className="flex flex-row gap-3">
              <div className="text-gray-600 font-bold text-sm leading-4">
                {item.label}
              </div>
              <div className="flex flex-row items-center gap-0.5">
                <div className="text-gray-600 font-bold text-sm leading-4 font-sf-pro">
                  {formatAmount(item.amount)}
                </div>
                <div className="text-gray-500 font-bold text-xs leading-4">
                  {item.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* モバイル版レイアウト */}
      <div className="sm:hidden flex flex-row items-center gap-3">
        <div className="text-gray-800 font-bold text-sm leading-6">
          {mainBalance.title}
        </div>

        <div className="flex flex-col items-end gap-2 flex-1">
          {/* メイン値 */}
          <div className="flex flex-row justify-end gap-10">
            <div className="flex flex-row items-end gap-1">
              <div
                className="text-gray-800 font-bold font-sf-pro"
                style={{ fontSize: "28px", lineHeight: "1.2" }}
              >
                {mainBalance.amount}
              </div>
              <div className="text-gray-500 font-normal text-xs leading-4">
                {mainBalance.unit}
              </div>
            </div>
          </div>

          {/* 詳細項目 */}
          <div className="flex flex-col items-end gap-1">
            {balanceItems.map((item, index) => (
              <div key={index} className="flex flex-row gap-3">
                <div className="text-gray-600 font-bold text-xs leading-4">
                  {item.label}
                </div>
                <div className="flex flex-row items-center gap-0.5">
                  <div className="text-gray-600 font-bold text-xs leading-4 font-sf-pro">
                    {formatAmount(item.amount)}
                  </div>
                  <div className="text-gray-500 font-bold text-xs leading-4">
                    {item.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
