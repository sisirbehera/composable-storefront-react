'use client';

import React from 'react';

export interface SortOption {
  code: string;
  name: string;
}

export interface SortSelectorProps {
  currentSort: string;
  onSortChange: (sortCode: string) => void;
  options?: SortOption[];
}

const defaultSortOptions: SortOption[] = [
  { code: 'relevance', name: 'Relevance' },
  { code: 'price-asc', name: 'Price: Low to High' },
  { code: 'price-desc', name: 'Price: High to Low' },
  { code: 'rating', name: 'Highest Customer Rating' },
  { code: 'name-asc', name: 'Name: A to Z' },
];

export const SortSelector: React.FC<SortSelectorProps> = ({
  currentSort,
  onSortChange,
  options = defaultSortOptions,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
        Sort By:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm outline-none"
      >
        {options.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};
