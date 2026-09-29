'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CmsComponent, SmartEditPerspective } from '@storefront/core';
import { SmartEditBridge } from './smartedit-bridge';

export interface SmartEditContextValue {
  perspective: SmartEditPerspective;
  setPerspective: (perspective: SmartEditPerspective) => void;
  isAuthoringMode: boolean;
  catalogVersion: 'Online' | 'Staged';
  setCatalogVersion: (ver: 'Online' | 'Staged') => void;
  isToolbarVisible: boolean;
  setToolbarVisible: (visible: boolean) => void;
  activeEditingComponent: { component: CmsComponent; slotId?: string } | null;
  setActiveEditingComponent: (item: { component: CmsComponent; slotId?: string } | null) => void;
  pickerSlotId: string | null;
  setPickerSlotId: (slotId: string | null) => void;
  componentOverrides: Record<string, Record<string, any>>;
  slotOverrides: Record<string, CmsComponent[]>;
  updateComponentProperties: (uid: string, properties: Record<string, any>) => void;
  removeComponentFromSlot: (slotId: string, uid: string) => void;
  reorderComponentInSlot: (slotId: string, uid: string, direction: 'up' | 'down') => void;
  addComponentToSlot: (slotId: string, component: CmsComponent) => void;
  resetAllOverrides: () => void;
}

const SmartEditContext = createContext<SmartEditContextValue | null>(null);

export interface SmartEditProviderProps {
  children: React.ReactNode;
  defaultPerspective?: SmartEditPerspective;
}

export const SmartEditProvider: React.FC<SmartEditProviderProps> = ({
  children,
  defaultPerspective = 'PREVIEW',
}) => {
  const [perspective, setPerspective] = useState<SmartEditPerspective>(defaultPerspective);
  const [catalogVersion, setCatalogVersion] = useState<'Online' | 'Staged'>('Staged');
  const [isToolbarVisible, setToolbarVisible] = useState<boolean>(true);
  const [activeEditingComponent, setActiveEditingComponent] = useState<{
    component: CmsComponent;
    slotId?: string;
  } | null>(null);
  const [pickerSlotId, setPickerSlotId] = useState<string | null>(null);

  // Live overrides applied by the content author
  const [componentOverrides, setComponentOverrides] = useState<Record<string, Record<string, any>>>({});
  const [slotOverrides, setSlotOverrides] = useState<Record<string, CmsComponent[]>>({});

  useEffect(() => {
    SmartEditBridge.initialize();

    // Sync perspective with SmartEdit parent iframe
    const unsubPerspective = SmartEditBridge.onPerspectiveChange((p) => {
      setPerspective(p);
    });

    // Handle incoming live component updates from parent iframe
    const unsubUpdate = SmartEditBridge.onComponentUpdate((payload) => {
      setComponentOverrides((prev) => ({
        ...prev,
        [payload.uid]: {
          ...(prev[payload.uid] || {}),
          ...payload.properties,
        },
      }));
    });

    return () => {
      unsubPerspective();
      unsubUpdate();
    };
  }, []);

  const isAuthoringMode = perspective === 'BASIC_EDIT' || perspective === 'ADVANCED_EDIT';

  const updateComponentProperties = (uid: string, newProps: Record<string, any>) => {
    setComponentOverrides((prev) => ({
      ...prev,
      [uid]: {
        ...(prev[uid] || {}),
        ...newProps,
      },
    }));

    // Dispatch update notification to SmartEdit
    SmartEditBridge.sendToSmartEdit('SMARTEDIT_COMPONENT_UPDATED', {
      uid,
      properties: newProps,
    });
  };

  const removeComponentFromSlot = (slotId: string, uid: string) => {
    setSlotOverrides((prev) => {
      const current = prev[slotId] || [];
      return {
        ...prev,
        [slotId]: current.filter((c) => c.uid !== uid),
      };
    });
  };

  const reorderComponentInSlot = (
    slotId: string,
    uid: string,
    direction: 'up' | 'down'
  ) => {
    setSlotOverrides((prev) => {
      const current = [...(prev[slotId] || [])];
      const index = current.findIndex((c) => c.uid === uid);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;

      const [removed] = current.splice(index, 1);
      current.splice(targetIndex, 0, removed);

      return {
        ...prev,
        [slotId]: current,
      };
    });
  };

  const addComponentToSlot = (slotId: string, component: CmsComponent) => {
    setSlotOverrides((prev) => {
      const current = prev[slotId] || [];
      return {
        ...prev,
        [slotId]: [...current, component],
      };
    });
  };

  const resetAllOverrides = () => {
    setComponentOverrides({});
    setSlotOverrides({});
  };

  return (
    <SmartEditContext.Provider
      value={{
        perspective,
        setPerspective,
        isAuthoringMode,
        catalogVersion,
        setCatalogVersion,
        isToolbarVisible,
        setToolbarVisible,
        activeEditingComponent,
        setActiveEditingComponent,
        pickerSlotId,
        setPickerSlotId,
        componentOverrides,
        slotOverrides,
        updateComponentProperties,
        removeComponentFromSlot,
        reorderComponentInSlot,
        addComponentToSlot,
        resetAllOverrides,
      }}
    >
      {children}
    </SmartEditContext.Provider>
  );
};

export function useSmartEdit(): SmartEditContextValue {
  const ctx = useContext(SmartEditContext);
  if (!ctx) {
    throw new Error('useSmartEdit must be used within a SmartEditProvider');
  }
  return ctx;
}
