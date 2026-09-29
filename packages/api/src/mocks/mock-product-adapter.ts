import { Facet, FacetValue, Product, ProductSearchPage, SearchQuery } from '@storefront/core';
import { ProductAdapter } from '../contracts/product-adapter';
import { getAllMockProducts, getProductsForSite } from './fixtures/products.fixture';
import { measureAdapterCall } from '../logger/adapter-logger';

export class MockProductAdapter implements ProductAdapter {
  private delayMs: number;

  constructor(delayMs: number = 80) {
    this.delayMs = delayMs;
  }

  private async delay(): Promise<void> {
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }
  }

  async getProduct(code: string): Promise<Product | null> {
    return measureAdapterCall('ProductAdapter', 'getProduct', async () => {
      await this.delay();
      const all = getAllMockProducts();
      const product = all.find((p) => p.code.toLowerCase() === code.toLowerCase());
      return product ? JSON.parse(JSON.stringify(product)) : null;
    }, { code });
  }

  async searchProducts(query: SearchQuery): Promise<ProductSearchPage> {
    return measureAdapterCall('ProductAdapter', 'searchProducts', async () => {
      await this.delay();
      let dataset = [...getProductsForSite(query.baseSiteId)];

    // 1. Text Search Filter
    if (query.query) {
      const q = query.query.toLowerCase().trim();
      dataset = dataset.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          p.categories?.some((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      );
    }

    // 2. Category Code Filter (from URL route e.g. /category/audio)
    if (query.categoryCode) {
      const cat = query.categoryCode.toLowerCase();
      dataset = dataset.filter((p) =>
        p.categories?.some((c) => c.code.toLowerCase() === cat)
      );
    }

    // Pre-facet filtered pool for calculating facet counts
    const baseFilteredPool = [...dataset];

    // 3. Apply Multi-Facet Filters
    const selectedFacets = query.selectedFacets || {};

    if (selectedFacets['brand'] && selectedFacets['brand'].length > 0) {
      const selectedBrands = selectedFacets['brand'].map((b) => b.toLowerCase());
      dataset = dataset.filter((p) => p.brand && selectedBrands.includes(p.brand.toLowerCase()));
    }

    if (selectedFacets['category'] && selectedFacets['category'].length > 0) {
      const selectedCats = selectedFacets['category'].map((c) => c.toLowerCase());
      dataset = dataset.filter((p) =>
        p.categories?.some((c) => selectedCats.includes(c.code.toLowerCase()) || selectedCats.includes(c.name.toLowerCase()))
      );
    }

    if (selectedFacets['price'] && selectedFacets['price'].length > 0) {
      dataset = dataset.filter((p) => {
        const val = p.price?.value || 0;
        return selectedFacets['price'].some((range) => {
          if (range === 'under-100') return val < 100;
          if (range === '100-500') return val >= 100 && val < 500;
          if (range === '500-1000') return val >= 500 && val < 1000;
          if (range === 'over-1000') return val >= 1000;
          return true;
        });
      });
    }

    if (selectedFacets['stock'] && selectedFacets['stock'].length > 0) {
      dataset = dataset.filter((p) => {
        return selectedFacets['stock'].some((status) => {
          if (status === 'inStock') return p.stock?.stockLevelStatus === 'inStock';
          if (status === 'outOfStock') return p.stock?.stockLevelStatus === 'outOfStock';
          return true;
        });
      });
    }

    // 4. Calculate Dynamic Facets from the base pool
    const facets: Facet[] = this.buildFacets(baseFilteredPool, selectedFacets);

    // 5. Apply Sorting
    const sort = query.sort || 'relevance';
    dataset = this.sortProducts(dataset, sort);

    // 6. Pagination
    const pageSize = query.pageSize || 6;
    const currentPage = query.currentPage || 0;
    const totalResults = dataset.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
    const startIndex = currentPage * pageSize;
    const paginatedProducts = dataset.slice(startIndex, startIndex + pageSize);

      return {
        products: JSON.parse(JSON.stringify(paginatedProducts)),
        pagination: {
          currentPage,
          pageSize,
          totalPages,
          totalResults,
          sort,
        },
        facets,
        freeTextSearch: query.query,
      };
    }, { query: query.query, site: query.baseSiteId });
  }

  private sortProducts(products: Product[], sort: string): Product[] {
    const list = [...products];
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => (a.price?.value || 0) - (b.price?.value || 0));
      case 'price-desc':
        return list.sort((a, b) => (b.price?.value || 0) - (a.price?.value || 0));
      case 'rating':
        return list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'relevance':
      default:
        return list;
    }
  }

  private buildFacets(pool: Product[], selected: Record<string, string[]>): Facet[] {
    // Brand Facet
    const brandCounts: Record<string, number> = {};
    pool.forEach((p) => {
      if (p.brand) {
        brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      }
    });

    const brandValues: FacetValue[] = Object.entries(brandCounts).map(([brand, count]) => ({
      name: brand,
      code: brand,
      count,
      selected: (selected['brand'] || []).includes(brand),
    }));

    // Category Facet
    const categoryCounts: Record<string, { name: string; count: number }> = {};
    pool.forEach((p) => {
      p.categories?.forEach((c) => {
        if (!categoryCounts[c.code]) {
          categoryCounts[c.code] = { name: c.name, count: 0 };
        }
        categoryCounts[c.code].count += 1;
      });
    });

    const categoryValues: FacetValue[] = Object.entries(categoryCounts).map(([code, meta]) => ({
      name: meta.name,
      code,
      count: meta.count,
      selected: (selected['category'] || []).includes(code),
    }));

    // Price Tier Facet
    const priceBuckets = [
      { code: 'under-100', name: 'Under $100', min: 0, max: 100 },
      { code: '100-500', name: '$100 - $500', min: 100, max: 500 },
      { code: '500-1000', name: '$500 - $1,000', min: 500, max: 1000 },
      { code: 'over-1000', name: 'Over $1,000', min: 1000, max: Infinity },
    ];

    const priceValues: FacetValue[] = priceBuckets
      .map((bucket) => {
        const count = pool.filter((p) => {
          const val = p.price?.value || 0;
          return val >= bucket.min && val < bucket.max;
        }).length;
        return {
          name: bucket.name,
          code: bucket.code,
          count,
          selected: (selected['price'] || []).includes(bucket.code),
        };
      })
      .filter((b) => b.count > 0);

    // Stock Status Facet
    const inStockCount = pool.filter((p) => p.stock?.stockLevelStatus === 'inStock').length;
    const outOfStockCount = pool.filter((p) => p.stock?.stockLevelStatus === 'outOfStock').length;

    const stockValues: FacetValue[] = [
      {
        name: 'In Stock',
        code: 'inStock',
        count: inStockCount,
        selected: (selected['stock'] || []).includes('inStock'),
      },
      {
        name: 'Out of Stock',
        code: 'outOfStock',
        count: outOfStockCount,
        selected: (selected['stock'] || []).includes('outOfStock'),
      },
    ].filter((s) => s.count > 0);

    return [
      { name: 'Category', code: 'category', values: categoryValues },
      { name: 'Brand', code: 'brand', values: brandValues },
      { name: 'Price Range', code: 'price', values: priceValues },
      { name: 'Availability', code: 'stock', values: stockValues },
    ].filter((f) => f.values.length > 0);
  }

  async getSuggestions(term: string): Promise<string[]> {
    return measureAdapterCall('ProductAdapter', 'getSuggestions', async () => {
      await this.delay();
      const q = term.toLowerCase().trim();
      if (!q) return [];
      return getAllMockProducts()
        .filter((p) => p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)))
        .map((p) => p.name)
        .slice(0, 5);
    }, { term });
  }
}
