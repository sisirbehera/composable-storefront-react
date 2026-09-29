import { OccConfig, Product, ProductSearchPage, SearchQuery } from '@storefront/core';
import { ProductAdapter } from '../contracts/product-adapter';
import { OccClient } from './occ-client';
import { normalizeOccProduct, normalizeOccProductSearch } from './occ-normalizers';

export class OccProductAdapter implements ProductAdapter {
  private client: OccClient;
  private baseUrl: string;

  constructor(config: OccConfig) {
    this.client = new OccClient(config);
    this.baseUrl = config.baseUrl;
  }

  async getProduct(code: string): Promise<Product | null> {
    try {
      const raw = await this.client.fetch<any>(`products/${encodeURIComponent(code)}`, {}, {
        fields: 'FULL',
      });
      return normalizeOccProduct(raw, this.baseUrl);
    } catch (err) {
      console.warn(`[OccProductAdapter] Failed to fetch product ${code}:`, err);
      return null;
    }
  }

  async searchProducts(query: SearchQuery): Promise<ProductSearchPage> {
    try {
      // Build OCC facet search query string: e.g. "freeText:relevance:brand:Sony:category:audio"
      let occQuery = query.query || '';
      const sort = query.sort || 'relevance';

      if (query.selectedFacets && Object.keys(query.selectedFacets).length > 0) {
        occQuery = `${occQuery}:${sort}`;
        Object.entries(query.selectedFacets).forEach(([facetCode, values]) => {
          values.forEach((val) => {
            occQuery += `:${facetCode}:${val}`;
          });
        });
      } else if (sort && sort !== 'relevance') {
        occQuery = `${occQuery}:${sort}`;
      }

      const raw = await this.client.fetch<any>('products/search', {}, {
        query: occQuery,
        currentPage: query.currentPage ?? 0,
        pageSize: query.pageSize ?? 12,
        sort: query.sort,
        fields: 'FULL',
      });
      return normalizeOccProductSearch(raw, this.baseUrl);
    } catch (err) {
      console.warn('[OccProductAdapter] Failed to search products:', err);
      return {
        products: [],
        pagination: { currentPage: 0, pageSize: 12, totalPages: 0, totalResults: 0 },
      };
    }
  }

  async getSuggestions(term: string): Promise<string[]> {
    try {
      const raw = await this.client.fetch<any>('products/suggestions', {}, {
        term,
        max: 5,
      });
      return (raw.suggestions || []).map((s: any) => s.value);
    } catch (err) {
      return [];
    }
  }
}
