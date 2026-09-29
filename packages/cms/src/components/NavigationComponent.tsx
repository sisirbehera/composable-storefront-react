'use client';

import React, { useState } from 'react';
import { NavigationComponentProperties } from '@storefront/core';

export interface NavigationComponentProps {
  properties: NavigationComponentProperties;
  uid?: string;
  name?: string;
}

export const NavigationComponent: React.FC<NavigationComponentProps> = ({
  properties,
}) => {
  const { navigationNode, styleClass = '' } = properties || {};
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  if (!navigationNode || !navigationNode.children || navigationNode.children.length === 0) {
    return null;
  }

  return (
    <nav className={`cms-navigation-container relative py-2 ${styleClass}`}>
      <ul className="flex items-center space-x-6">
        {navigationNode.children.map((child) => {
          const hasSubChildren = child.children && child.children.length > 0;
          const isDropdownOpen = activeDropdown === child.uid;

          return (
            <li
              key={child.uid}
              className="relative"
              onMouseEnter={() => hasSubChildren && setActiveDropdown(child.uid)}
              onMouseLeave={() => hasSubChildren && setActiveDropdown(null)}
            >
              <div className="flex items-center space-x-1 cursor-pointer py-1">
                <a
                  href={child.entries?.[0]?.url || `/category/${child.uid.toLowerCase()}`}
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 tracking-wide uppercase transition-colors"
                >
                  {child.title}
                </a>
                {hasSubChildren && (
                  <svg
                    className={`w-3 h-3 text-slate-400 transition-transform ${
                      isDropdownOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>

              {/* Multi-tier Dropdown Menu */}
              {hasSubChildren && isDropdownOpen && (
                <div className="absolute top-full left-0 z-50 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-xl py-2 px-1 animate-fade-in">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 border-b border-slate-100 mb-1">
                    {child.title}
                  </div>
                  {child.children!.map((subChild) => (
                    <a
                      key={subChild.uid}
                      href={subChild.entries?.[0]?.url || `/category/${subChild.uid.toLowerCase()}`}
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                    >
                      {subChild.title}
                    </a>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
