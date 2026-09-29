import { BaseSite, Currency, DEFAULT_BASE_SITES, DEFAULT_CURRENCIES, DEFAULT_LANGUAGES, Language } from '@storefront/core';
import { SiteContextAdapter } from '../contracts/site-context-adapter';

export class MockSiteContextAdapter implements SiteContextAdapter {
  private sites: BaseSite[] = [...DEFAULT_BASE_SITES];

  async getBaseSites(): Promise<BaseSite[]> {
    return this.sites;
  }

  async getBaseSite(siteId: string): Promise<BaseSite | null> {
    return this.sites.find((s) => s.uid === siteId) || null;
  }

  async getLanguages(baseSiteId?: string): Promise<Language[]> {
    if (baseSiteId) {
      const site = this.sites.find((s) => s.uid === baseSiteId);
      if (site) return site.languages;
    }
    return DEFAULT_LANGUAGES;
  }

  async getCurrencies(baseSiteId?: string): Promise<Currency[]> {
    if (baseSiteId) {
      const site = this.sites.find((s) => s.uid === baseSiteId);
      if (site) return site.currencies;
    }
    return DEFAULT_CURRENCIES;
  }
}
