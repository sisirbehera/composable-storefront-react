'use client';

import React from 'react';
import { SmartEditPerspective } from '@storefront/core';
import { useSmartEdit } from './SmartEditContext';

export const SmartEditToolbar: React.FC = () => {
  const {
    perspective,
    setPerspective,
    catalogVersion,
    setCatalogVersion,
    isToolbarVisible,
    setToolbarVisible,
    resetAllOverrides,
    componentOverrides,
    slotOverrides,
  } = useSmartEdit();

  const totalOverrides =
    Object.keys(componentOverrides).length + Object.keys(slotOverrides).length;

  if (!isToolbarVisible) {
    return (
      <button
        onClick={() => setToolbarVisible(true)}
        className="fixed bottom-5 left-5 z-[55] bg-slate-900 text-white p-2.5 rounded-full shadow-2xl border border-slate-700 hover:bg-slate-800 transition-all flex items-center space-x-2 text-xs font-bold cursor-pointer"
        title="Open SAP SmartEdit Studio"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
        <span>SmartEdit</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="SAP SmartEdit Authoring Studio"
      className="sticky top-0 z-50 bg-slate-950 text-white border-b border-slate-800 shadow-xl px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md bg-slate-950/95"
    >
      {/* Brand & Connection Badge */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
          <span className="font-extrabold tracking-tight text-white flex items-center space-x-1.5">
            <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
              SAP
            </span>
            <span>SmartEdit Studio</span>
          </span>
        </div>
        <span className="text-slate-600">|</span>
        <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
          Contract: <span className="text-emerald-400">postMessage Active</span>
        </span>
      </div>

      {/* Center Controls: Perspective Switcher & Catalog */}
      <div className="flex items-center space-x-3">
        {/* Perspective Dropdown */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="smartedit-perspective-select" className="text-slate-400 text-[11px]">Perspective:</label>
          <select
            id="smartedit-perspective-select"
            value={perspective}
            onChange={(e) => setPerspective(e.target.value as SmartEditPerspective)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="PREVIEW">Preview Mode</option>
            <option value="BASIC_EDIT">Basic Edit</option>
            <option value="ADVANCED_EDIT">Advanced Edit (Authoring)</option>
            <option value="PERSONALIZATION">Personalization</option>
          </select>
        </div>

        {/* Catalog Version */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="smartedit-catalog-select" className="text-slate-400 text-[11px]">Catalog:</label>
          <select
            id="smartedit-catalog-select"
            value={catalogVersion}
            onChange={(e) => setCatalogVersion(e.target.value as 'Online' | 'Staged')}
            className="bg-slate-800 border border-slate-700 text-amber-300 rounded-lg px-2 py-1 text-xs font-mono font-bold outline-none cursor-pointer"
          >
            <option value="Staged">Electronics (Staged)</option>
            <option value="Online">Electronics (Online)</option>
          </select>
        </div>

        {/* Page Sync Status */}
        <span className="hidden lg:inline-flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full font-medium">
          <span>●</span>
          <span>Approved</span>
        </span>
      </div>

      {/* Right Controls: Overrides status, reset, minimize */}
      <div className="flex items-center space-x-2">
        {totalOverrides > 0 && (
          <button
            onClick={resetAllOverrides}
            className="text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-700 px-2.5 py-1 rounded-lg hover:bg-amber-900 transition-colors cursor-pointer"
          >
            Reset {totalOverrides} Live Edit(s)
          </button>
        )}

        <button
          onClick={() => setToolbarVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer transition-colors"
          title="Minimize Toolbar"
        >
          ✕
        </button>
      </div>
    </aside>
  );
};
