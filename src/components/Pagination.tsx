'use client';

import getRange from '@/utils/getRange';
import Link from 'next/link';

// Defines the properties for the Pagination component.
type PaginationProps = {
  // The currently active page number (1-based index).
  activePage: number;
  // The maximum number of items per page.
  limit: number;
  // The total number of items across all pages.
  total: number;
  // Determines the mode: 'url' for Next.js routing, 'client' for internal state.
  mode: 'url' | 'client';
  // Callback for page changes in 'client' mode.
  onPageChange?: (page: number) => void;
  // The base URL pathname for links in 'url' mode.
  pathname?: string;
};

// A versatile pagination component for both URL and client-side page handling.
const Pagination = ({
  activePage,
  limit,
  total,
  mode,
  onPageChange,
  pathname,
}: PaginationProps) => {
  // Calculates the total number of pages required.
  const totalPages = Math.ceil(total / limit);

  // Helper function to render an individual pagination button or link.
  const renderButton = (num: number, label?: string, keySuffix = '') => {
    const content = label ?? num;
    const key = `${num}-${keySuffix}`;
    const isActive = activePage === num;

    const baseClasses =
      'px-3 py-1 rounded-md transition-colors duration-200 border border-border-subtle focus:outline-none';

    const activeClasses = 'bg-flame-500 text-gray-100 border-none';
    // Use a slightly different hover for the active state when using a Link to prevent the Link's hover from overriding the active color.
    const activeHoverClasses = 'hover:bg-flame-700';
    const inactiveClasses = 'hover:bg-surface-subtle';

    const finalClasses = `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${
      isActive && mode === 'url' ? activeHoverClasses : ''
    }`;

    // --- URL Mode: Renders a Next.js Link component ---
    if (mode === 'url') {
      return (
        <Link
          key={key}
          href={`${pathname ?? ''}?page=${num}`}
          className={finalClasses}
          // Improves accessibility by marking the current page.
          aria-current={isActive ? 'page' : undefined}
        >
          {content}
        </Link>
      );
    }

    // --- Client Mode: Renders a standard Button component ---
    return (
      <button
        key={key}
        onClick={() => onPageChange?.(num)}
        className={finalClasses}
        // Disables the active button in client mode for better UX and to prevent unnecessary state updates.
        disabled={isActive}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </button>
    );
  };

  // Only render page numbers if the total items exceed the limit.
  const shouldRenderPages = limit < total;

  return (
    <div className="flex gap-2 justify-center items-center my-8 flex-wrap">
      {/* Previous/First Page Buttons (if not on the first page) */}
      {activePage > 1 && (
        <>
          {/* First page button */}
          {renderButton(1, '«', 'first')}
          {/* Previous page button */}
          {renderButton(activePage - 1, '‹', 'prev')}
        </>
      )}

      {/* Main Page Numbers: Renders all pages based on the total. */}
      {shouldRenderPages &&
        getRange(1, totalPages + 1).map((num) => renderButton(num, undefined, `page-${num}`))}

      {/* Next/Last Page Buttons (if not on the last page) */}
      {activePage < totalPages && (
        <>
          {/* Next page button */}
          {renderButton(activePage + 1, '›', 'next')}
          {/* Last page button */}
          {renderButton(totalPages, '»', 'last')}
        </>
      )}
    </div>
  );
};

export default Pagination;
