import { Product, ProductSearchPage, SearchQuery } from '@storefront/core';

export interface ProductAdapter {
  getProduct(code: string): Promise<Product | null>;
  searchProducts(query: SearchQuery): Promise<ProductSearchPage>;
  getSuggestions(term: string): Promise<string[]>;
}
