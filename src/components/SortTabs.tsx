'use client';

import { FC } from 'react';
import { useLocale } from '@/components/LocaleContext';

// Defines the allowed sorting options and includes 'null' to represent no sorting/default state.
export type SortOption = 'mostPopular' | 'newest' | 'oldest' | null;

type SortTabsProps = {
  // The currently active sort option.
  sortBy: SortOption;
  // Callback function to handle the change in sorting preference.
  onChange: (option: SortOption) => void;
};

/**
 * A tab-based component for selecting a sorting preference, designed to work as a toggle.
 * Clicking an active tab deselects it (sets sortBy to null).
 */
const SortTabs: FC<SortTabsProps> = ({ sortBy, onChange }) => {
  const { locale } = useLocale();
  // Array defining the visible sort tabs.
  const options = [
    { key: 'mostPopular', label: locale === 'ja' ? '人気順' : 'Most Popular' },
    { key: 'newest', label: locale === 'ja' ? '新しい順' : 'Newest' },
    { key: 'oldest', label: locale === 'ja' ? '古い順' : 'Oldest' },
  ] as const; // 'as const' enforces the string literal types for keys.

  /**
   * Handles button click, toggling the sort option.
   * If the clicked key is already active, it sets the sort option to null (off).
   * Otherwise, it sets the sort option to the clicked key (on).
   */
  const handleClick = (key: Exclude<SortOption, null>) => {
    // Only pass the key type that is not null, as null is handled by the toggle logic.
    onChange(sortBy === key ? null : key);
  };

  return (
    <div className="flex justify-center pb-10 sm:pb-16">
      <div
        role="group"
        aria-label={locale === 'ja' ? '並び替え' : 'Sort content'}
        className="inline-flex max-w-full overflow-x-auto rounded-lg border border-border-subtle"
      >
        {options.map(({ key, label }) => {
          const isActive = sortBy === key;

          return (
            <button
              key={key}
              type="button"
              // Cast key to the non-null type before passing to handleClick
              onClick={() => handleClick(key)}
              className={`min-h-11 shrink-0 whitespace-nowrap px-3 py-3 text-xs transition-colors sm:min-h-0 sm:px-6 sm:py-2 sm:text-sm
              ${
                isActive
                  ? // Active state styling (primary color)
                    'bg-flame-500 hover:bg-flame-700 text-gray-100'
                  : // Inactive state styling (transparent with hover effects)
                    'bg-canvas hover:bg-surface-muted'
              }
              ${key != 'oldest' ? 'border-r border-r-border-subtle' : ''}
            `}
              aria-pressed={isActive}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortTabs;
