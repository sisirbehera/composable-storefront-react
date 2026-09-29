import { CmsPage, OccConfig } from '@storefront/core';
import { CmsAdapter } from '../contracts/cms-adapter';
import { OccClient } from './occ-client';
import { normalizeOccCmsPage } from './occ-normalizers';

export class OccCmsAdapter implements CmsAdapter {
  private client: OccClient;

  constructor(config: OccConfig) {
    this.client = new OccClient(config);
  }

  async getPage(slugOrId: string): Promise<CmsPage | null> {
    try {
      const cleanSlug = slugOrId.replace(/^\//, '') || 'homepage';
      const raw = await this.client.fetch<any>('cms/pages', {}, {
        pageType: 'ContentPage',
        pageLabelOrId: cleanSlug === 'homepage' ? '/homepage' : cleanSlug,
        fields: 'FULL',
      });
      return normalizeOccCmsPage(raw);
    } catch (err) {
      console.warn(`[OccCmsAdapter] Failed to fetch CMS page ${slugOrId}:`, err);
      return null;
    }
  }

  async getComponent<T = Record<string, any>>(uid: string): Promise<T | null> {
    try {
      const raw = await this.client.fetch<any>(`cms/components/${encodeURIComponent(uid)}`, {}, {
        fields: 'FULL',
      });
      return raw as T;
    } catch (err) {
      console.warn(`[OccCmsAdapter] Failed to fetch CMS component ${uid}:`, err);
      return null;
    }
  }
}
