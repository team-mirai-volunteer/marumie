"use client";
import "client-only";

const MAX_VISIBLE_BUTTONS = 10;
const HALF_VISIBLE_BUTTONS = Math.floor(MAX_VISIBLE_BUTTONS / 2);
const EDGE_THRESHOLD = HALF_VISIBLE_BUTTONS;
const EDGE_OFFSET = MAX_VISIBLE_BUTTONS - 1;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-center items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`bg-primary-accent text-white border-0 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors duration-200 ${
          currentPage <= 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-600"
        }`}
      >
        前へ
      </button>

      <div className="flex gap-1">
        {Array.from(
          { length: Math.min(MAX_VISIBLE_BUTTONS, totalPages) },
          (_, i) => {
            let pageNum: number;
            if (totalPages <= MAX_VISIBLE_BUTTONS) {
              pageNum = i + 1;
            } else if (currentPage <= EDGE_THRESHOLD) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - HALF_VISIBLE_BUTTONS + 1) {
              pageNum = totalPages - EDGE_OFFSET + i;
            } else {
              pageNum = currentPage - HALF_VISIBLE_BUTTONS + i;
            }

            return (
              <button
                type="button"
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 text-sm border-0 rounded-lg cursor-pointer transition-colors duration-200 text-white ${
                  pageNum === currentPage
                    ? "bg-primary-accent"
                    : "bg-primary-hover hover:bg-primary-border"
                }`}
              >
                {pageNum}
              </button>
            );
          },
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`bg-primary-accent text-white border-0 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors duration-200 ${
          currentPage >= totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-600"
        }`}
      >
        次へ
      </button>
    </div>
  );
}
