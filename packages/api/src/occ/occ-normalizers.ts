import { CmsComponent, CmsPage, CmsSlot, Price, Product, ProductSearchPage } from '@storefront/core';
import { validateNormalizedPayload } from '../logger/adapter-logger';

export function normalizeOccPrice(occPrice?: any): Price | undefined {
  if (!occPrice) return undefined;
  return {
    currencyIso: occPrice.currencyIso || 'USD',
    value: occPrice.value || 0,
    formattedValue: occPrice.formattedValue || `$${occPrice.value?.toFixed(2) || '0.00'}`,
    priceType: occPrice.priceType,
  };
}

export function normalizeOccProduct(raw: any, occBaseUrl: string = ''): Product {
  validateNormalizedPayload('Product', raw?.code || 'unknown', raw, ['code', 'name']);
  return {
    code: raw.code || '',
    name: raw.name || '',
    summary: raw.summary,
    description: raw.description,
    price: normalizeOccPrice(raw.price),
    averageRating: raw.averageRating,
    numberOfReviews: raw.numberOfReviews,
    stock: {
      stockLevelStatus: raw.stock?.stockLevelStatus === 'inStock' ? 'inStock' : 'outOfStock',
      stockLevel: raw.stock?.stockLevel,
    },
    images: (raw.images || []).map((img: any) => ({
      format: img.format || 'product',
      imageType: img.imageType || 'PRIMARY',
      url: img.url?.startsWith('http') ? img.url : `${occBaseUrl}${img.url}`,
      altText: img.altText || raw.name,
    })),
    categories: (raw.categories || []).map((c: any) => ({
      code: c.code,
      name: c.name,
      url: c.url,
    })),
    classifications: (raw.classifications || []).flatMap((c: any) =>
      (c.features || []).map((f: any) => ({
        code: f.code,
        name: f.name,
        value: f.featureValues?.map((v: any) => v.value).join(', ') || '',
      }))
    ),
    url: `/products/${raw.code}`,
  };
}

export function normalizeOccProductSearch(raw: any, occBaseUrl: string = ''): ProductSearchPage {
  return {
    products: (raw.products || []).map((p: any) => normalizeOccProduct(p, occBaseUrl)),
    pagination: {
      currentPage: raw.pagination?.currentPage || 0,
      pageSize: raw.pagination?.pageSize || 20,
      totalPages: raw.pagination?.totalPages || 1,
      totalResults: raw.pagination?.totalResults || 0,
      sort: raw.pagination?.sort,
    },
    facets: raw.facets,
    freeTextSearch: raw.freeTextSearch,
  };
}

export function normalizeOccCmsPage(raw: any): CmsPage {
  validateNormalizedPayload('CmsPage', raw?.uid || raw?.pageId || 'unknown', raw, ['uid']);
  const slotsRecord: Record<string, CmsSlot> = {};

  const contentSlots = raw.contentSlots?.contentSlot || [];
  for (const cs of contentSlots) {
    const position = cs.position || cs.slotId;
    const rawComponents = cs.components?.component || [];

    const components: CmsComponent[] = rawComponents.map((c: any) => ({
      uid: c.uid,
      typeCode: c.typeCode,
      name: c.name,
      modifiedTime: c.modifiedTime,
      properties: { ...c },
    }));

    slotsRecord[position] = {
      slotId: cs.slotId || position,
      position,
      name: cs.name,
      components,
    };
  }

  return {
    pageId: raw.uid || raw.pageId || 'unknownPage',
    template: raw.template || 'LandingPage2Template',
    title: raw.title,
    description: raw.description,
    robotTag: raw.robotTag,
    slots: slotsRecord,
  };
}
