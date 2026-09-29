import { BaseSite, Currency, DEFAULT_BASE_SITES, DEFAULT_CURRENCIES, DEFAULT_LANGUAGES, Language, OccConfig } from '@storefront/core';
import { SiteContextAdapter } from '../contracts/site-context-adapter';
import { OccClient } from './occ-client';

export class OccSiteContextAdapter implements SiteContextAdapter {
  private client: OccClient;

  constructor(config: OccConfig) {
    this.client = new OccClient(config);
  }

  async getBaseSites(): Promise<BaseSite[]> {
    try {
      const raw = await this.client.get<{ baseSites: any[] }>('basesites');
      if (raw?.baseSites && raw.baseSites.length > 0) {
        return raw.baseSites.map((site) => ({
          uid: site.uid,
          name: site.name || site.uid,
          defaultLanguage: site.defaultLanguage?.isocode || 'en',
          languages: (site.languages || []).map((l: any) => ({
            isocode: l.isocode,
            name: l.name,
            nativeName: l.nativeName || l.name,
            active: l.active ?? true,
          })),
          defaultCurrency: site.defaultCurrency?.isocode || 'USD',
          currencies: (site.currencies || []).map((c: any) => ({
            isocode: c.isocode,
            symbol: c.symbol || c.isocode,
            name: c.name || c.isocode,
            rate: c.rate || 1.0,
            active: c.active ?? true,
          })),
          channel: site.channel === 'B2B' ? 'B2B' : 'B2C',
          theme: site.theme,
          urlPatterns: site.urlPatterns || [],
        }));
      }
    } catch (e) {
      console.warn('[OccSiteContextAdapter] Failed to fetch baseSites from OCC, falling back to defaults:', e);
    }
    return DEFAULT_BASE_SITES;
  }

  async getBaseSite(siteId: string): Promise<BaseSite | null> {
    const sites = await this.getBaseSites();
    return sites.find((s) => s.uid === siteId) || null;
  }

  async getLanguages(baseSiteId?: string): Promise<Language[]> {
    try {
      const raw = await this.client.get<{ languages: any[] }>('languages');
      if (raw?.languages && raw.languages.length > 0) {
        return raw.languages.map((l) => ({
          isocode: l.isocode,
          name: l.name,
          nativeName: l.nativeName || l.name,
          active: l.active ?? true,
        }));
      }
    } catch (e) {
      console.warn('[OccSiteContextAdapter] Failed to fetch languages from OCC:', e);
    }
    return DEFAULT_LANGUAGES;
  }

  async getCurrencies(baseSiteId?: string): Promise<Currency[]> {
    try {
      const raw = await this.client.get<{ currencies: any[] }>('currencies');
      if (raw?.currencies && raw.currencies.length > 0) {
        return raw.currencies.map((c) => ({
          isocode: c.isocode,
          symbol: c.symbol || c.isocode,
          name: c.name || c.isocode,
          rate: c.rate || 1.0,
          active: c.active ?? true,
        }));
      }
    } catch (e) {
      console.warn('[OccSiteContextAdapter] Failed to fetch currencies from OCC:', e);
    }
    return DEFAULT_CURRENCIES;
  }
}
