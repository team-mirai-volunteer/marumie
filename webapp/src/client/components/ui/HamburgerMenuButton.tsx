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
      className="p-1 hover:bg-gray-100 transition-colors"
      onClick={onClick}
      aria-label="メニューを開く"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <span
          className={`block w-4 h-0.5 bg-gray-800 transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-[6px]" : ""
          }`}
        />
        <span
          className={`block w-4 h-0.5 bg-gray-800 mt-1 transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-4 h-0.5 bg-gray-800 mt-1 transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-[6px]" : ""
          }`}
        />
      </div>
    </button>
  );
}
