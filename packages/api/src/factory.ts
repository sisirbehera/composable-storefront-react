import { StorefrontConfig, getStorefrontConfig } from '@storefront/core';
import { ProductAdapter } from './contracts/product-adapter';
import { CmsAdapter } from './contracts/cms-adapter';
import { CartAdapter } from './contracts/cart-adapter';
import { CheckoutAdapter } from './contracts/checkout-adapter';
import { UserAdapter } from './contracts/user-adapter';
import { SiteContextAdapter } from './contracts/site-context-adapter';
import { MockProductAdapter } from './mocks/mock-product-adapter';
import { MockCmsAdapter } from './mocks/mock-cms-adapter';
import { MockCartAdapter } from './mocks/mock-cart-adapter';
import { MockCheckoutAdapter } from './mocks/mock-checkout-adapter';
import { MockUserAdapter } from './mocks/mock-user-adapter';
import { MockSiteContextAdapter } from './mocks/mock-site-context-adapter';
import { OccProductAdapter } from './occ/occ-product-adapter';
import { OccCmsAdapter } from './occ/occ-cms-adapter';
import { OccCheckoutAdapter } from './occ/occ-checkout-adapter';
import { OccUserAdapter } from './occ/occ-user-adapter';
import { OccSiteContextAdapter } from './occ/occ-site-context-adapter';

import { ContentfulCmsAdapter } from './contentful/contentful-cms-adapter';

export class AdapterFactory {
  private config: StorefrontConfig;
  private productAdapter?: ProductAdapter;
  private cmsAdapter?: CmsAdapter;
  private cartAdapter?: CartAdapter;
  private checkoutAdapter?: CheckoutAdapter;
  private userAdapter?: UserAdapter;
  private siteContextAdapter?: SiteContextAdapter;

  constructor(config?: StorefrontConfig) {
    this.config = config || getStorefrontConfig();
  }

  getProductAdapter(): ProductAdapter {
    if (!this.productAdapter) {
      if (this.config.commerce.useMockData) {
        this.productAdapter = new MockProductAdapter();
      } else {
        this.productAdapter = new OccProductAdapter(this.config.commerce.occ);
      }
    }
    return this.productAdapter;
  }

  getCmsAdapter(): CmsAdapter {
    if (!this.cmsAdapter) {
      if (this.config.cms.provider === 'contentful') {
        this.cmsAdapter = new ContentfulCmsAdapter(
          this.config.cms.contentful,
          this.config.commerce.useMockData
        );
      } else if (this.config.commerce.useMockData) {
        this.cmsAdapter = new MockCmsAdapter();
      } else {
        this.cmsAdapter = new OccCmsAdapter(this.config.commerce.occ);
      }
    }
    return this.cmsAdapter!;
  }

  getCartAdapter(): CartAdapter {
    if (!this.cartAdapter) {
      this.cartAdapter = new MockCartAdapter();
    }
    return this.cartAdapter;
  }

  getCheckoutAdapter(): CheckoutAdapter {
    if (!this.checkoutAdapter) {
      if (this.config.commerce.useMockData) {
        this.checkoutAdapter = new MockCheckoutAdapter(this.getCartAdapter());
      } else {
        this.checkoutAdapter = new OccCheckoutAdapter(this.config.commerce.occ);
      }
    }
    return this.checkoutAdapter;
  }

  getUserAdapter(): UserAdapter {
    if (!this.userAdapter) {
      if (this.config.commerce.useMockData) {
        this.userAdapter = new MockUserAdapter();
      } else {
        this.userAdapter = new OccUserAdapter(this.config.commerce.occ);
      }
    }
    return this.userAdapter;
  }

  getSiteContextAdapter(): SiteContextAdapter {
    if (!this.siteContextAdapter) {
      if (this.config.commerce.useMockData) {
        this.siteContextAdapter = new MockSiteContextAdapter();
      } else {
        this.siteContextAdapter = new OccSiteContextAdapter(this.config.commerce.occ);
      }
    }
    return this.siteContextAdapter;
  }
}

// Singleton helper
let defaultFactory: AdapterFactory | null = null;

export function getAdapterFactory(config?: StorefrontConfig): AdapterFactory {
  if (!defaultFactory || (config && defaultFactory['config'] !== config)) {
    defaultFactory = new AdapterFactory(config);
  }
  return defaultFactory;
}

export function resetAdapterFactory(): void {
  defaultFactory = null;
}

