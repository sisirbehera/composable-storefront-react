'use client';

import React, { useState } from 'react';
import { TabContainerComponentProperties } from '@storefront/core';

export interface TabContainerComponentProps {
  properties: TabContainerComponentProperties;
  uid?: string;
  name?: string;
}

export const TabContainerComponent: React.FC<TabContainerComponentProps> = ({
  properties,
}) => {
  const { title, tabs = [] } = properties || {};
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || '');

  if (!tabs || tabs.length === 0) {
    return null;
  }

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className="cms-tab-container my-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {title && (
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
        </div>
      )}

      {/* Tabs Navigation Header */}
      <div className="flex border-b border-slate-200 px-6 space-x-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={`py-3.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.title}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="p-6">
        <div className="prose prose-sm text-slate-600 leading-relaxed max-w-none text-xs sm:text-sm">
          {activeTab.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
