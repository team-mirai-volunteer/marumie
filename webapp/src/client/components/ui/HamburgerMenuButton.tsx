"use client";
import "client-only";

interface HamburgerMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function HamburgerMenuButton({
  isOpen,
  onClick,
}: HamburgerMenuButtonProps) {
  return (
    <button
      type="button"
      className="p-1 hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={onClick}
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
      aria-expanded={isOpen}
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center relative">
        {/* 上の棒 */}
        <span
          className={`absolute top-1.5 block w-4 h-0.5 bg-gray-800 transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />

        {/* 真ん中の2本の棒（重なっている） */}
        <span
          className={`absolute block w-4 h-0.5 bg-gray-800 transition-all duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        />
        <span
          className={`absolute block w-4 h-0.5 bg-gray-800 transition-all duration-300 ${
            isOpen ? "-rotate-45" : ""
          }`}
        />

        {/* 下の棒 */}
        <span
          className={`absolute bottom-1.5 block w-4 h-0.5 bg-gray-800 transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
      </div>
    </button>
  );
}
