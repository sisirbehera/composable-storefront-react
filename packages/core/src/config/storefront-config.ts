export interface OccConfig {
  baseUrl: string;
  prefix: string;
  baseSite: string;
  clientSecret?: string;
  clientId?: string;
}

export interface SmartEditConfig {
  enabled: boolean;
  allowOrigin?: string;
}

export interface ContentfulConfig {
  spaceId?: string;
  accessToken?: string;
  environment?: string;
}

export interface CmsConfig {
  provider: 'hybris' | 'contentful' | 'custom';
  smartEdit: SmartEditConfig;
  contentful?: ContentfulConfig;
}

export interface CommerceConfig {
  useMockData: boolean;
  occ: OccConfig;
  currency: string;
  language: string;
}

export interface StorefrontConfig {
  commerce: CommerceConfig;
  cms: CmsConfig;
}

export const defaultStorefrontConfig: StorefrontConfig = {
  commerce: {
    useMockData: true,
    occ: {
      baseUrl: 'https://localhost:9002',
      prefix: '/occ/v2/',
      baseSite: 'electronics-spa',
      clientId: 'mobile_android',
      clientSecret: 'secret',
    },
    currency: 'USD',
    language: 'en',
  },
  cms: {
    provider: 'hybris',
    smartEdit: {
      enabled: false,
    },
  },
};

let currentConfig: StorefrontConfig = { ...defaultStorefrontConfig };

export function configureStorefront(customConfig: Partial<StorefrontConfig>): StorefrontConfig {
  currentConfig = {
    ...currentConfig,
    ...customConfig,
    commerce: {
      ...currentConfig.commerce,
      ...customConfig.commerce,
      occ: {
        ...currentConfig.commerce.occ,
        ...customConfig.commerce?.occ,
      },
    },
    cms: {
      ...currentConfig.cms,
      ...customConfig.cms,
      smartEdit: {
        ...currentConfig.cms.smartEdit,
        ...customConfig.cms?.smartEdit,
      },
    },
  };
  return currentConfig;
}

export function getStorefrontConfig(): StorefrontConfig {
  return currentConfig;
}
