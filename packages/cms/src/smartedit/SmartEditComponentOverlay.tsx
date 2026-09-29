'use client';

import React from 'react';
import { CmsComponent } from '@storefront/core';
import { useSmartEdit } from './SmartEditContext';

export interface SmartEditComponentOverlayProps {
  component: CmsComponent;
  slotId?: string;
  children: React.ReactNode;
}

export const SmartEditComponentOverlay: React.FC<SmartEditComponentOverlayProps> = ({
  component,
  slotId = '',
  children,
}) => {
  const {
    isAuthoringMode,
    catalogVersion,
    setActiveEditingComponent,
    reorderComponentInSlot,
    removeComponentFromSlot,
    addComponentToSlot,
  } = useSmartEdit();

  if (!isAuthoringMode) {
    return <>{children}</>;
  }

  const handleDuplicate = () => {
    const clone: CmsComponent = {
      ...component,
      uid: `${component.uid}-clone-${Date.now().toString(36).slice(-4)}`,
      name: `${component.name || component.typeCode} (Copy)`,
      properties: JSON.parse(JSON.stringify(component.properties)),
    };
    addComponentToSlot(slotId, clone);
  };

  return (
    <div
      className="smartedit-component-wrapper relative group/se my-2 border-2 border-dashed border-blue-400 hover:border-blue-600 rounded-xl transition-all duration-150 p-1"
      data-smartedit-component-id={component.uid}
      data-smartedit-component-uuid={component.uid}
      data-smartedit-component-type={component.typeCode}
      data-smartedit-catalog-version-uuid={catalogVersion}
    >
      {/* Floating SmartEdit Contextual Action Bar */}
      <div className="absolute -top-3.5 left-2 z-30 hidden group-hover/se:flex items-center space-x-1.5 bg-slate-900 text-white rounded-lg shadow-xl px-2 py-1 text-[11px] font-mono border border-slate-700 animate-fade-in">
        <span className="font-bold text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded text-[10px]">
          {component.typeCode}
        </span>
        <span className="text-slate-400 text-[10px]">({component.uid})</span>

        <span className="text-slate-600">|</span>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => setActiveEditingComponent({ component, slotId })}
          className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
          title="Edit Component Properties"
        >
          ✏️ Edit
        </button>

        {/* Move Up */}
        <button
          type="button"
          onClick={() => reorderComponentInSlot(slotId, component.uid, 'up')}
          className="hover:bg-slate-800 text-slate-300 hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer"
          title="Move Component Up"
        >
          ▲
        </button>

        {/* Move Down */}
        <button
          type="button"
          onClick={() => reorderComponentInSlot(slotId, component.uid, 'down')}
          className="hover:bg-slate-800 text-slate-300 hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer"
          title="Move Component Down"
        >
          ▼
        </button>

        {/* Duplicate */}
        <button
          type="button"
          onClick={handleDuplicate}
          className="hover:bg-slate-800 text-slate-300 hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer"
          title="Clone Component"
        >
          📄 Clone
        </button>

        {/* Remove */}
        <button
          type="button"
          onClick={() => removeComponentFromSlot(slotId, component.uid)}
          className="hover:bg-rose-900 text-rose-300 hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer"
          title="Remove Component"
        >
          ✕
        </button>
      </div>

      {children}
    </div>
  );
};
