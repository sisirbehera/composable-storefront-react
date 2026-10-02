'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@storefront/auth';
import { SiteContextProvider, ThemeProvider, StorefrontDevTools } from '@storefront/ui';
import {
  SmartEditBridge,
  OutletProvider,
  SmartEditProvider,
  SmartEditToolbar,
  SmartEditEditModal,
  SmartEditComponentPickerModal,
} from '@storefront/cms';

/**
 * SmartEdit Studio Authoring Tools:
 * Restricts the authoring toolbar and editing modals to authorized CMS Admins.
 * For demo/POC purposes, Alex Morgan is recognized as the authorized CMS Author.
 */
const SmartEditAdminBar: React.FC = () => {
  const { authState } = useAuth();

  const isAlexMorganOrAdmin =
    authState.isAuthenticated &&
    Boolean(
      authState.user?.name?.toLowerCase().includes('alex morgan') ||
      authState.user?.uid?.toLowerCase().includes('alex.morgan')
    );

  if (!isAlexMorganOrAdmin) {
    return null;
  }

  return (
    <>
      <SmartEditToolbar authorName={authState.user?.name} />
      <SmartEditEditModal />
      <SmartEditComponentPickerModal />
    </>
  );
};

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
    <ThemeProvider defaultTheme="light">
      <SiteContextProvider onSiteChange={handleSiteChange}>
        <SmartEditProvider defaultPerspective="PREVIEW">
          <OutletProvider>
            <AuthProvider>
              <SmartEditAdminBar />
              {children}
              <StorefrontDevTools />
            </AuthProvider>
          </OutletProvider>
        </SmartEditProvider>
      </SiteContextProvider>
    </ThemeProvider>
  );
};


