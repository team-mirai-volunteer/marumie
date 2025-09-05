"use client";

export default function BalanceSheetChart() {
  return (
    <div className="flex justify-center mt-10">
      <div className="grid grid-cols-2 gap-6 w-fit">
        {/* 流動資産 */}
        <div className="bg-cyan-200 rounded-lg p-6 w-64 h-24 flex flex-col items-center justify-center">
          <div className="text-center space-y-1">
            <h3 className="font-bold text-black text-lg">流動資産</h3>
            <div className="flex items-end gap-0.5">
              <span className="font-bold text-xl text-black">1</span>
              <span className="text-sm font-medium text-black">億</span>
              <span className="font-bold text-xl text-black">2345</span>
              <span className="text-sm font-medium text-black">万円</span>
            </div>
          </div>
        </div>

        {/* 流動負債 */}
        <div className="bg-red-200 rounded-lg p-6 w-64 h-52 flex flex-col items-center justify-center">
          <div className="text-center space-y-2">
            <h3 className="font-bold text-black text-lg">流動負債</h3>
            <div className="flex items-end gap-0.5">
              <span className="font-bold text-xl text-black">1</span>
              <span className="text-sm font-medium text-black">億</span>
              <span className="font-bold text-xl text-black">2345</span>
              <span className="text-sm font-medium text-black">万円</span>
            </div>
          </div>
        </div>

        {/* 固定資産 */}
        <div className="bg-teal-400 rounded-lg p-6 w-64 h-46 flex flex-col items-center justify-center">
          <div className="text-center space-y-1">
            <h3 className="font-bold text-black text-lg">固定資産</h3>
            <div className="flex items-end gap-0.5">
              <span className="font-bold text-xl text-black">1</span>
              <span className="text-sm font-medium text-black">億</span>
              <span className="font-bold text-xl text-black">2345</span>
              <span className="text-sm font-medium text-black">万円</span>
            </div>
          </div>
        </div>

        {/* 固定負債 */}
        <div className="bg-red-400 rounded-lg p-6 w-64 h-46 flex flex-col items-center justify-center">
          <div className="text-center space-y-1">
            <h3 className="font-bold text-black text-lg">固定負債</h3>
            <div className="flex items-end gap-0.5">
              <span className="font-bold text-xl text-black">1</span>
              <span className="text-sm font-medium text-black">億</span>
              <span className="font-bold text-xl text-black">2345</span>
              <span className="text-sm font-medium text-black">万円</span>
            </div>
          </div>
        </div>

        {/* 債務超過 */}
        <div className="border-2 border-dashed border-red-600 rounded-lg p-6 w-64 h-28 flex flex-col items-center justify-center col-span-1">
          <div className="text-center space-y-1">
            <h3 className="font-bold text-red-600 text-lg">債務超過</h3>
            <div className="flex items-end gap-0.5">
              <span className="font-bold text-lg text-red-600">▲</span>
              <span className="font-bold text-xl text-red-600">1</span>
              <span className="text-sm font-medium text-red-600">億</span>
              <span className="font-bold text-xl text-red-600">2345</span>
              <span className="text-sm font-medium text-red-600">万円</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
