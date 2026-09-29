'use client';

import React, { useCallback, useEffect } from 'react';
import { Header, useSiteContext, useCartStore } from '@storefront/ui';
import { useRouter } from 'next/navigation';
import { appConfig } from '@/config/storefront.config';
import { getAdapterFactory } from '@storefront/api';
import { useAuth } from '@storefront/auth';

export const StorefrontHeader: React.FC = () => {
  const router = useRouter();
  const { authState, logout } = useAuth();
  const { activeSite } = useSiteContext();
  const { loadCart, clearCart } = useCartStore();
  const siteParam = activeSite ? `?site=${activeSite.uid}` : '';

  useEffect(() => {
    loadCart(activeSite.uid);
  }, [activeSite.uid, authState.isAuthenticated, loadCart]);

  const handleFetchSuggestions = useCallback(async (term: string) => {
    const factory = getAdapterFactory(appConfig);
    const adapter = factory.getProductAdapter();
    return adapter.getSuggestions(term);
  }, []);

  const handleSearch = useCallback((query: string) => {
    const siteQuery = activeSite ? `&site=${activeSite.uid}` : '';
    router.push(`/search?query=${encodeURIComponent(query)}${siteQuery}`);
  }, [router, activeSite]);

  return (
    <Header
      useMockData={appConfig.commerce.useMockData}
      user={authState.user}
      isAuthenticated={authState.isAuthenticated}
      onNavigateHome={() => router.push(`/${siteParam}`)}
      onNavigateBrowseAll={() => router.push(`/search${siteParam}`)}
      onNavigateCart={() => router.push('/cart')}
      onNavigateLogin={() => router.push('/login')}
      onNavigateAccount={() => router.push('/my-account')}
      onNavigateOrders={() => router.push('/my-account/orders')}
      onNavigateAddresses={() => router.push('/my-account/address-book')}
      onNavigatePaymentMethods={() => router.push('/my-account/payment-methods')}
      onLogout={async () => {
        await clearCart();
        logout();
        router.push(`/${siteParam}`);
      }}
      onSearch={handleSearch}
      onFetchSuggestions={handleFetchSuggestions}
    />
  );
};
