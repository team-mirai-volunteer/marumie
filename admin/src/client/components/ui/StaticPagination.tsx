"use client";

import Link from "next/link";

interface StaticPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function StaticPagination({
  currentPage,
  totalPages,
  basePath,
}: StaticPaginationProps) {
  const generatePageUrl = (page: number) => {
    return `${basePath}?page=${page}`;
  };

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
        <Link
          key={page}
          href={generatePageUrl(page)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            page === currentPage
              ? "bg-primary-accent text-white"
              : "text-primary-muted hover:bg-primary-border hover:text-white"
          }`}
        >
          {page}
        </Link>,
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {currentPage > 1 && (
        <Link
          href={generatePageUrl(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-primary-muted hover:bg-primary-border hover:text-white rounded-md transition-colors"
        >
          ← 前
        </Link>
      )}

      {renderPageNumbers()}

      {currentPage < totalPages && (
        <Link
          href={generatePageUrl(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-primary-muted hover:bg-primary-border hover:text-white rounded-md transition-colors"
        >
          次 →
        </Link>
      )}
    </div>
  );
}
