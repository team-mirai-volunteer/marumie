import Image from "next/image";

interface TransactionTableHeaderProps {
  allowControl?: boolean;
}

export default function TransactionTableHeader({
  allowControl = false,
}: TransactionTableHeaderProps) {
  return (
    <thead className="bg-white">
      <tr className="h-12 border-b border-[#D5DBE1]">
        {/* 日付 - Sortable when allowControl is true */}
        <th className="px-4 py-0 text-left w-35">
          <div className="flex items-center justify-center gap-1 h-5">
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
        </th>

        {/* 項目項目 - No controls */}
        <th className="px-0 py-0 text-left flex-1">
          <div className="flex items-center h-5">
            <span className="text-gray-800 text-sm font-bold leading-[1.286] tracking-[0.071em]">
              項目項目
            </span>
          </div>
        </th>

        {/* 金額 - Sortable when allowControl is true */}
        <th className="px-4 py-0 text-left w-30">
          <div className="flex items-center justify-center gap-1 h-5">
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
        </th>

        {/* 決済手段 - Filterable when allowControl is true */}
        <th className="px-0 py-0 text-left w-22">
          <div className="flex items-center justify-center gap-1 h-12">
            <span className="text-gray-800 text-sm font-bold leading-[1.5]">
              決済手段
            </span>
            {allowControl && (
              <div className="w-3 h-2 flex items-center justify-center">
                <Image
                  src="/icons/icon_filter.svg"
                  alt="Filter payment method"
                  width={12}
                  height={8}
                  className="w-3 h-2"
                />
              </div>
            )}
          </div>
        </th>

        {/* カテゴリー - Filterable when allowControl is true */}
        <th className="px-0 py-0 text-left w-40">
          <div className="flex items-center justify-center gap-1 h-12">
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
        </th>
      </tr>
    </thead>
  );
}
