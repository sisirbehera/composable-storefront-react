'use client';

import React from 'react';

export interface ActiveFilterItem {
  facetCode: string;
  facetName: string;
  valueCode: string;
  valueName: string;
}

export interface ActiveFiltersProps {
  filters: ActiveFilterItem[];
  onRemoveFilter: (facetCode: string, valueCode: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {filters.map((filter) => (
        <span
          key={`${filter.facetCode}-${filter.valueCode}`}
          className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-slate-300 rounded-full text-xs font-medium text-slate-800 shadow-sm"
        >
          <span className="text-slate-400">{filter.facetName}:</span>
          <span>{filter.valueName}</span>
          <button
            type="button"
            onClick={() => onRemoveFilter(filter.facetCode, filter.valueCode)}
            className="text-slate-400 hover:text-rose-500 font-bold ml-1 transition-colors cursor-pointer"
            aria-label={`Remove filter ${filter.valueName}`}
          >
            ×
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-semibold text-blue-600 hover:text-blue-800 ml-auto cursor-pointer"
      >
        Clear All
      </button>
    </div>
  );
};
