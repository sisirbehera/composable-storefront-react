import React from 'react';
import { CmsComponent } from '@storefront/core';
import { CmsComponentRegistry } from '../registry/component-registry';
import { Outlet } from '../outlets/Outlet';
import { SmartEditComponentOverlay } from '../smartedit/SmartEditComponentOverlay';
import { useSmartEdit } from '../smartedit/SmartEditContext';

export interface CmsComponentWrapperProps {
  component: CmsComponent;
  slotId?: string;
  isSmartEditEnabled?: boolean;
}

export const CmsComponentWrapper: React.FC<CmsComponentWrapperProps> = ({
  component,
  slotId,
  isSmartEditEnabled = false,
}) => {
  const ComponentToRender = CmsComponentRegistry.getComponent(component.typeCode);

  // Read live overrides from SmartEdit context if present
  let effectiveProps = component.properties;
  let catalogVersion = 'Staged';

  try {
    const sm = useSmartEdit();
    if (sm.componentOverrides[component.uid]) {
      effectiveProps = {
        ...effectiveProps,
        ...sm.componentOverrides[component.uid],
      };
    }
    catalogVersion = sm.catalogVersion;
  } catch {
    // Graceful fallback if used outside SmartEditProvider
  }

  const effectiveComponent: CmsComponent = {
    ...component,
    properties: effectiveProps,
  };

  const smartEditProps = isSmartEditEnabled
    ? {
        'data-smartedit-component-id': component.uid,
        'data-smartedit-component-type': component.typeCode,
        'data-smartedit-component-uuid': component.uid,
        'data-smartedit-catalog-version-uuid': catalogVersion,
        className: 'smartEditComponent smartedit-component-container relative group',
      }
    : {};

  return (
    <SmartEditComponentOverlay component={effectiveComponent} slotId={slotId}>
      <div {...smartEditProps}>
        <Outlet
          name={`CmsComponent.${component.typeCode}`}
          context={{ component: effectiveComponent }}
        >
          <ComponentToRender
            properties={effectiveProps}
            uid={component.uid}
            name={component.name}
          />
        </Outlet>
      </div>
    </SmartEditComponentOverlay>
  );
};


