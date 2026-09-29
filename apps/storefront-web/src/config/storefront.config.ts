import { configureStorefront, StorefrontConfig } from '@storefront/core';

// Check environment variable (defaults to true for demo/offline capability)
const isMockEnabled =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA !== undefined
    ? process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
    : true;

export const appConfig: StorefrontConfig = configureStorefront({
  commerce: {
    useMockData: isMockEnabled,
    occ: {
      baseUrl: process.env.NEXT_PUBLIC_OCC_BASE_URL || 'https://localhost:9002',
      prefix: process.env.NEXT_PUBLIC_OCC_PREFIX || '/occ/v2/',
      baseSite: process.env.NEXT_PUBLIC_OCC_BASE_SITE || 'electronics-spa',
      clientId: process.env.NEXT_PUBLIC_OCC_CLIENT_ID || 'mobile_android',
      clientSecret: process.env.NEXT_PUBLIC_OCC_CLIENT_SECRET || 'secret',
    },
    currency: 'USD',
    language: 'en',
  },
  cms: {
    provider: 'hybris',
    smartEdit: {
      enabled: process.env.NEXT_PUBLIC_SMARTEDIT_ENABLED === 'true',
    },
  },
});
