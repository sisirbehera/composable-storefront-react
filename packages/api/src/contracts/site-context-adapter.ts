import { BaseSite, Currency, Language } from '@storefront/core';

export interface SiteContextAdapter {
  getBaseSites(): Promise<BaseSite[]>;
  getBaseSite(siteId: string): Promise<BaseSite | null>;
  getLanguages(baseSiteId?: string): Promise<Language[]>;
  getCurrencies(baseSiteId?: string): Promise<Currency[]>;
}
