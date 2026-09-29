'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@storefront/auth';
import { SiteContextProvider, StorefrontDevTools } from '@storefront/ui';
import {
  SmartEditBridge,
  OutletProvider,
  SmartEditProvider,
  SmartEditToolbar,
  SmartEditEditModal,
  SmartEditComponentPickerModal,
} from '@storefront/cms';

export const StorefrontProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    SmartEditBridge.initialize();
  }, []);

  const handleSiteChange = (_site: any, targetUrl: string) => {
    router.push(targetUrl);
    router.refresh();
  };

  return (
    <SiteContextProvider onSiteChange={handleSiteChange}>
      <SmartEditProvider defaultPerspective="PREVIEW">
        <OutletProvider>
          <AuthProvider>
            <SmartEditToolbar />
            {children}
            <SmartEditEditModal />
            <SmartEditComponentPickerModal />
            <StorefrontDevTools />
          </AuthProvider>
        </OutletProvider>
      </SmartEditProvider>
    </SiteContextProvider>
  );
};


