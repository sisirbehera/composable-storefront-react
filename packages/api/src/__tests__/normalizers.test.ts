import { describe, it, expect } from 'vitest';
import {
  normalizeOccPrice,
  normalizeOccProduct,
  normalizeOccProductSearch,
  normalizeOccCmsPage,
} from '../occ/occ-normalizers';

describe('OCC Normalizers', () => {
  describe('normalizeOccPrice', () => {
    it('normalizes valid price object', () => {
      const raw = { currencyIso: 'EUR', value: 49.99, formattedValue: '49,99 €' };
      const normalized = normalizeOccPrice(raw);
      expect(normalized).toEqual({
        currencyIso: 'EUR',
        value: 49.99,
        formattedValue: '49,99 €',
        priceType: undefined,
      });
    });

    it('returns undefined for missing or null price', () => {
      expect(normalizeOccPrice(undefined)).toBeUndefined();
      expect(normalizeOccPrice(null)).toBeUndefined();
    });

    it('provides fallback formatting when formattedValue is missing', () => {
      const raw = { currencyIso: 'USD', value: 25.5 };
      const normalized = normalizeOccPrice(raw);
      expect(normalized?.formattedValue).toBe('$25.50');
    });
  });

  describe('normalizeOccProduct', () => {
    it('normalizes complete OCC raw product data into domain Product', () => {
      const rawOcc = {
        code: 'CONF-DEMO-001',
        name: 'Spartacus Pro Headset',
        summary: 'Studio quality noise cancellation',
        description: 'Comprehensive description here',
        price: { currencyIso: 'USD', value: 199.99, formattedValue: '$199.99' },
        averageRating: 4.8,
        numberOfReviews: 32,
        stock: { stockLevelStatus: 'inStock', stockLevel: 25 },
        images: [
          { format: 'product', imageType: 'PRIMARY', url: '/medias/headset.jpg', altText: 'Headset' },
        ],
        categories: [{ code: 'audio', name: 'Audio', url: '/category/audio' }],
        classifications: [
          {
            code: 'tech_specs',
            features: [
              { code: 'battery', name: 'Battery Life', featureValues: [{ value: '30h' }] },
            ],
          },
        ],
      };

      const product = normalizeOccProduct(rawOcc, 'https://occ.backend.demo');

      expect(product.code).toBe('CONF-DEMO-001');
      expect(product.name).toBe('Spartacus Pro Headset');
      expect(product.price?.value).toBe(199.99);
      expect(product.stock?.stockLevelStatus).toBe('inStock');
      expect(product.images?.[0]?.url).toBe('https://occ.backend.demo/medias/headset.jpg');
      expect(product.categories?.[0].code).toBe('audio');
      expect(product.classifications?.[0].name).toBe('Battery Life');
      expect(product.classifications?.[0].value).toBe('30h');
      expect(product.url).toBe('/products/CONF-DEMO-001');
    });

    it('gracefully handles missing optional product fields', () => {
      const bareRaw = { code: 'BARE-001', name: 'Bare Product' };
      const product = normalizeOccProduct(bareRaw);

      expect(product.code).toBe('BARE-001');
      expect(product.name).toBe('Bare Product');
      expect(product.price).toBeUndefined();
      expect(product.stock?.stockLevelStatus).toBe('outOfStock');
      expect(product.images).toEqual([]);
      expect(product.categories).toEqual([]);
    });
  });

  describe('normalizeOccCmsPage', () => {
    it('maps OCC contentSlots structure to indexed slots record', () => {
      const rawCms = {
        uid: 'homepage',
        template: 'LandingPage2Template',
        title: 'Welcome Home',
        contentSlots: {
          contentSlot: [
            {
              slotId: 'Section1',
              position: 'Section1',
              name: 'Hero Slot',
              components: {
                component: [
                  {
                    uid: 'HeroBanner1',
                    typeCode: 'CMSParagraphComponent',
                    name: 'Hero Banner',
                    content: '<h1>Spring Sale</h1>',
                  },
                ],
              },
            },
            {
              slotId: 'Section2A',
              components: {
                component: [
                  {
                    uid: 'Carousel1',
                    typeCode: 'ProductCarouselComponent',
                    title: 'Featured Products',
                  },
                ],
              },
            },
          ],
        },
      };

      const cmsPage = normalizeOccCmsPage(rawCms);

      expect(cmsPage.pageId).toBe('homepage');
      expect(cmsPage.template).toBe('LandingPage2Template');
      expect(cmsPage.slots['Section1']).toBeDefined();
      expect(cmsPage.slots['Section1'].components).toHaveLength(1);
      expect(cmsPage.slots['Section1'].components[0].typeCode).toBe('CMSParagraphComponent');
      expect(cmsPage.slots['Section2A'].components[0].typeCode).toBe('ProductCarouselComponent');
    });
  });

  describe('normalizeOccProductSearch', () => {
    it('normalizes search pagination, facets, and product list', () => {
      const rawSearch = {
        products: [{ code: 'P1', name: 'Product 1' }, { code: 'P2', name: 'Product 2' }],
        pagination: { currentPage: 0, pageSize: 12, totalPages: 1, totalResults: 2 },
        freeTextSearch: 'headphone',
      };

      const result = normalizeOccProductSearch(rawSearch);
      expect(result.products).toHaveLength(2);
      expect(result.pagination.totalResults).toBe(2);
      expect(result.freeTextSearch).toBe('headphone');
    });
  });
});
