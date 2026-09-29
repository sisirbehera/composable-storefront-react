import { CmsPage } from '@storefront/core';
import { CmsAdapter } from '../contracts/cms-adapter';
import { mockCmsPages } from './fixtures/cms-pages.fixture';
import { measureAdapterCall } from '../logger/adapter-logger';

export class MockCmsAdapter implements CmsAdapter {
  private delayMs: number;

  constructor(delayMs: number = 50) {
    this.delayMs = delayMs;
  }

  private async delay(): Promise<void> {
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }
  }

  async getPage(slugOrId: string, baseSiteId?: string): Promise<CmsPage | null> {
    return measureAdapterCall('CmsAdapter', 'getPage', async () => {
      await this.delay();
      const cleanSlug = slugOrId.replace(/^\//, '') || 'homepage';
      let page = null;
      if (cleanSlug === 'homepage' && baseSiteId) {
        page = mockCmsPages[`homepage-${baseSiteId}`];
      }
      if (!page) {
        page = mockCmsPages[cleanSlug] || mockCmsPages['homepage'];
      }
      return page ? JSON.parse(JSON.stringify(page)) : null;
    }, { slugOrId, baseSiteId });
  }

  async getComponent<T = Record<string, any>>(uid: string): Promise<T | null> {
    return measureAdapterCall('CmsAdapter', 'getComponent', async () => {
      await this.delay();
      for (const page of Object.values(mockCmsPages)) {
        for (const slot of Object.values(page.slots)) {
          const found = slot.components.find((c) => c.uid === uid);
          if (found) {
            return JSON.parse(JSON.stringify(found.properties)) as T;
          }
        }
      }
      return null;
    }, { uid });
  }
}
