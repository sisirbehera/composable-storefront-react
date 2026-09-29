'use client';

import React, { useState } from 'react';
import { Facet, FacetValue } from '@storefront/core';

export interface FacetGroupProps {
  facet: Facet;
  onToggleFacet: (facetCode: string, valueCode: string) => void;
  defaultExpanded?: boolean;
}

export const FacetGroup: React.FC<FacetGroupProps> = ({
  facet,
  onToggleFacet,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-slate-200 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 group"
      >
        <span>{facet.name}</span>
        <span className="text-slate-400 group-hover:text-slate-600 transition-transform">
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2.5">
          {facet.values.map((val: FacetValue) => {
            const valCode = val.code || val.name;
            return (
              <label
                key={valCode}
                className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer group select-none"
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={val.selected}
                    onChange={() => onToggleFacet(facet.code, valCode)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={val.selected ? 'font-semibold text-blue-600' : ''}>
                    {val.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 group-hover:text-slate-500 font-mono">
                  ({val.count})
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};
