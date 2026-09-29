'use client';

import React from 'react';
import { CmsPage } from '@storefront/core';
import { CmsSlot } from './CmsSlot';

export interface CmsPageLayoutProps {
  page: CmsPage;
  isSmartEditEnabled?: boolean;
}

export const CmsPageLayout: React.FC<CmsPageLayoutProps> = ({
  page,
  isSmartEditEnabled = false,
}) => {
  const { slots, template } = page;

  // Render slots in natural order or according to template layout
  const slotKeys = Object.keys(slots);

  return (
    <div className={`cms-page-layout template-${template} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6`}>
      {slotKeys.map((position) => (
        <CmsSlot
          key={position}
          slot={slots[position]}
          position={position}
          isSmartEditEnabled={isSmartEditEnabled}
        />
      ))}
    </div>
  );
};
