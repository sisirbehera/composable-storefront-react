import { describe, it, expect, beforeEach } from 'vitest';
import { AdapterFactory, resetAdapterFactory, getAdapterFactory } from '../factory';
import { MockProductAdapter } from '../mocks/mock-product-adapter';
import { OccProductAdapter } from '../occ/occ-product-adapter';
import { MockCmsAdapter } from '../mocks/mock-cms-adapter';
import { OccCmsAdapter } from '../occ/occ-cms-adapter';
import { ContentfulCmsAdapter } from '../contentful/contentful-cms-adapter';
import { StorefrontConfig } from '@storefront/core';

describe('AdapterFactory (Pluggable Backend Architecture)', () => {
  beforeEach(() => {
    resetAdapterFactory();
  });

  it('provides MockProductAdapter when useMockData is true', () => {
    const mockConfig: StorefrontConfig = {
      commerce: {
        useMockData: true,
        occ: { baseUrl: '', prefix: '/occ/v2/', baseSite: 'electronics-spa' },
        currency: 'USD',
        language: 'en',
      },
      cms: {
        provider: 'hybris',
        smartEdit: { enabled: false },
      },
    };

    const factory = new AdapterFactory(mockConfig);
    const productAdapter = factory.getProductAdapter();
    expect(productAdapter).toBeInstanceOf(MockProductAdapter);

    const cmsAdapter = factory.getCmsAdapter();
    expect(cmsAdapter).toBeInstanceOf(MockCmsAdapter);
  });

  it('provides OccProductAdapter and OccCmsAdapter when useMockData is false', () => {
    const liveConfig: StorefrontConfig = {
      commerce: {
        useMockData: false,
        occ: { baseUrl: 'https://occ.demo.internal', prefix: '/occ/v2/', baseSite: 'electronics-spa' },
        currency: 'USD',
        language: 'en',
      },
      cms: {
        provider: 'hybris',
        smartEdit: { enabled: false },
      },
    };

    const factory = new AdapterFactory(liveConfig);
    const productAdapter = factory.getProductAdapter();
    expect(productAdapter).toBeInstanceOf(OccProductAdapter);

    const cmsAdapter = factory.getCmsAdapter();
    expect(cmsAdapter).toBeInstanceOf(OccCmsAdapter);
  });

  it('provides ContentfulCmsAdapter when cms provider is contentful', () => {
    const contentfulConfig: StorefrontConfig = {
      commerce: {
        useMockData: true,
        occ: { baseUrl: '', prefix: '/occ/v2/', baseSite: 'electronics-spa' },
        currency: 'USD',
        language: 'en',
      },
      cms: {
        provider: 'contentful',
        smartEdit: { enabled: false },
        contentful: { spaceId: 'demo-space', accessToken: 'demo-token', environment: 'master' },
      },
    };

    const factory = new AdapterFactory(contentfulConfig);
    const cmsAdapter = factory.getCmsAdapter();
    expect(cmsAdapter).toBeInstanceOf(ContentfulCmsAdapter);
  });

  it('maintains singleton instance via getAdapterFactory', () => {
    const f1 = getAdapterFactory();
    const f2 = getAdapterFactory();
    expect(f1).toBe(f2);
  });
});
