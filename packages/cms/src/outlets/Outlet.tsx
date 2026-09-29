'use client';

import React from 'react';
import { useOutlet, OutletItemContext } from './OutletContext';

export interface OutletProps<T = any> {
  name: string;
  context?: T;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Spartacus-style Outlet component.
 * Acts as an extension point where external modules can prepend (BEFORE),
 * override (REPLACE), or append (AFTER) components without modifying templates.
 */
export function Outlet<T = any>({
  name,
  context,
  className = '',
  children,
}: OutletProps<T>) {
  const { before, replace, after, hasReplace, isHighlightEnabled } = useOutlet(name);

  const ReplaceComponent = replace ? replace.component : null;

  return (
    <OutletItemContext.Provider value={context}>
      <div
        data-outlet-name={name}
        className={`cx-outlet-container relative ${
          isHighlightEnabled
            ? 'border-2 border-dashed border-purple-400 p-1 my-1 rounded-lg transition-all'
            : ''
        } ${className}`}
      >
        {isHighlightEnabled && (
          <div className="absolute -top-3 left-2 z-30 bg-purple-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow tracking-wider uppercase">
            Outlet: {name} ({before.length}B / {hasReplace ? '1R' : '0R'} / {after.length}A)
          </div>
        )}

        {/* 1. BEFORE Outlets (Prepended) */}
        {before.map((reg) => {
          const BeforeComp = reg.component;
          return <BeforeComp key={reg.id} context={context} />;
        })}

        {/* 2. REPLACE Outlet or Default Children */}
        {hasReplace && ReplaceComponent ? (
          <ReplaceComponent context={context} />
        ) : (
          children
        )}

        {/* 3. AFTER Outlets (Appended) */}
        {after.map((reg) => {
          const AfterComp = reg.component;
          return <AfterComp key={reg.id} context={context} />;
        })}
      </div>
    </OutletItemContext.Provider>
  );
}
