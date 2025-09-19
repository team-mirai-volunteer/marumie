"use client";

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ClientPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ClientPaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            page === currentPage
              ? "bg-primary-accent text-white"
              : "text-primary-muted hover:bg-primary-border hover:text-white"
          }`}
        >
          {page}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {currentPage > 1 && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-primary-muted hover:bg-primary-border hover:text-white rounded-md transition-colors cursor-pointer"
        >
          ← 前
        </button>
      )}

      {renderPageNumbers()}

      {currentPage < totalPages && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-primary-muted hover:bg-primary-border hover:text-white rounded-md transition-colors cursor-pointer"
        >
          次 →
        </button>
      )}
    </div>
  );
}
