import { CmsPage, ContentfulConfig } from '@storefront/core';
import { CmsAdapter } from '../contracts/cms-adapter';
import { ContentfulClient } from './contentful-client';
import { ContentfulNormalizer } from './contentful-normalizer';

export class ContentfulCmsAdapter implements CmsAdapter {
  private client: ContentfulClient;

  constructor(config?: ContentfulConfig, useMockData = true) {
    this.client = new ContentfulClient(config, useMockData);
  }

  async getPage(pageId: string): Promise<CmsPage | null> {
    const rawData = await this.client.getPageEntries(pageId);
    if (!rawData) {
      return null;
    }

    return ContentfulNormalizer.normalizePage(rawData, pageId);
  }

  async getComponent<T = Record<string, any>>(uid: string): Promise<T | null> {
    const page = await this.getPage('homepage');
    if (!page) return null;

    for (const slot of Object.values(page.slots)) {
      const found = slot.components.find((c) => c.uid === uid);
      if (found) {
        return JSON.parse(JSON.stringify(found.properties)) as T;
      }
    }
    return null;
  }
}

