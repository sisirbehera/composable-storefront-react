import React from 'react';
import { CmsSlot as CmsSlotModel, CmsComponent } from '@storefront/core';
import { CmsComponentWrapper } from './CmsComponentWrapper';
import { Outlet } from '../outlets/Outlet';
import { useSmartEdit } from '../smartedit/SmartEditContext';

export interface CmsSlotProps {
  slot?: CmsSlotModel;
  position?: string;
  isSmartEditEnabled?: boolean;
}

export const CmsSlot: React.FC<CmsSlotProps> = ({
  slot,
  position,
  isSmartEditEnabled = false,
}) => {
  const slotPosition = position || slot?.position || 'UnknownSlot';

  let effectiveComponents: CmsComponent[] = slot?.components || [];
  let isAuthoring = false;
  let onOpenPicker: (() => void) | null = null;

  try {
    const sm = useSmartEdit();
    isAuthoring = sm.isAuthoringMode;
    if (sm.slotOverrides[slotPosition]) {
      effectiveComponents = sm.slotOverrides[slotPosition];
    }
    onOpenPicker = () => sm.setPickerSlotId(slotPosition);
  } catch {
    // Fallback outside SmartEditProvider
  }

  if (!slot && effectiveComponents.length === 0) {
    return null;
  }

  const smartEditSlotProps = (isSmartEditEnabled || isAuthoring)
    ? {
        'data-smartedit-slot-id': slot?.slotId || slotPosition,
        'data-smartedit-slot-uuid': slot?.slotId || slotPosition,
        className: `smartEditComponent smartedit-slot-container my-4 relative ${
          isAuthoring
            ? 'border-2 border-dashed border-slate-300 rounded-2xl p-3 bg-slate-50/40 transition-colors hover:border-blue-400'
            : ''
        }`,
      }
    : {
        className: 'cms-slot-container',
      };

  return (
    <div {...smartEditSlotProps} data-slot-position={slotPosition}>
      {/* SmartEdit Slot Header Overlay in Authoring Mode */}
      {isAuthoring && (
        <div className="flex items-center justify-between bg-slate-200/80 px-3 py-1.5 rounded-lg mb-3 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm text-[11px]">
              Slot: {slotPosition}
            </span>
            <span className="text-slate-500 text-[10px]">
              ({effectiveComponents.length} component{effectiveComponents.length !== 1 ? 's' : ''})
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenPicker || undefined}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <span>+</span>
            <span>Add Component</span>
          </button>
        </div>
      )}

      <Outlet name={`CmsSlot.${slotPosition}`} context={{ slot, position: slotPosition }}>
        {effectiveComponents.map((component) => (
          <CmsComponentWrapper
            key={component.uid}
            component={component}
            slotId={slotPosition}
            isSmartEditEnabled={isSmartEditEnabled || isAuthoring}
          />
        ))}
      </Outlet>
    </div>
  );
};

