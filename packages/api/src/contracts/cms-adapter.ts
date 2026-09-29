import { CmsPage } from '@storefront/core';

export interface CmsAdapter {
  getPage(slugOrId: string, baseSiteId?: string): Promise<CmsPage | null>;
  getComponent<T = Record<string, any>>(uid: string): Promise<T | null>;
}
