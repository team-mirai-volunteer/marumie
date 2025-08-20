import Image from "next/image";

interface TransactionTableHeaderProps {
  allowControl?: boolean;
}

export default function TransactionTableHeader({
  allowControl = false,
}: TransactionTableHeaderProps) {
  return (
    <div className="bg-white">
      <div className="flex items-center h-12 border-b border-[#D5DBE1] px-0">
        {/* 日付 - 140px width to match row */}
        <div
          className="flex items-center justify-start px-4 h-full"
          style={{ width: "140px" }}
        >
          <div className="flex items-center gap-1 h-5">
            <span className="text-gray-800 text-sm font-bold leading-[1.5]">
              日付
            </span>
            {allowControl && (
              <div className="w-5 h-5 flex items-center justify-center">
                <Image
                  src="/icons/icon_chevron-down.svg"
                  alt="Sort by date"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
            )}
          </div>
        </div>

        {/* 項目項目 - flexible width to match row */}
        <div className="flex items-center h-full flex-1">
          <div className="flex items-center h-5">
            <span className="text-gray-800 text-sm font-bold leading-[1.286] tracking-[0.071em]">
              項目項目
            </span>
          </div>
        </div>

        {/* 金額 - 144px width to match row (combined plus/minus + amount) */}
        <div
          className="flex items-center justify-end h-full"
          style={{ width: "144px" }}
        >
          <div className="flex items-center gap-1 h-5">
            <span className="text-gray-800 text-sm font-bold leading-[1.5]">
              金額
            </span>
            {allowControl && (
              <div className="w-5 h-5 flex items-center justify-center">
                <Image
                  src="/icons/icon_chevron-down.svg"
                  alt="Sort by amount"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
            )}
          </div>
        </div>

        {/* カテゴリー - 160px width to match row */}
        <div className="flex items-center h-full" style={{ width: "160px" }}>
          <div className="flex items-center gap-1 h-12">
            <span className="text-gray-800 text-sm font-bold leading-[1.5]">
              カテゴリー
            </span>
            {allowControl && (
              <div className="w-3 h-2 flex items-center justify-center">
                <Image
                  src="/icons/icon_filter.svg"
                  alt="Filter category"
                  width={12}
                  height={8}
                  className="w-3 h-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
