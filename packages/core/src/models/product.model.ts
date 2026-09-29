export interface Price {
  currencyIso: string;
  value: number;
  formattedValue: string;
  priceType?: 'BUY' | 'BASE';
}

export interface Stock {
  stockLevelStatus: 'inStock' | 'lowStock' | 'outOfStock';
  stockLevel?: number;
}

export interface ImageMedia {
  format: 'thumbnail' | 'product' | 'zoom' | 'cartIcon';
  imageType: 'PRIMARY' | 'GALLERY';
  url: string;
  altText?: string;
}

export interface Category {
  code: string;
  name: string;
  url?: string;
}

export interface ClassificationFeature {
  name: string;
  code: string;
  value: string;
}

export interface Product {
  code: string;
  name: string;
  brand?: string;
  summary?: string;
  description?: string;
  price?: Price;
  images?: ImageMedia[];
  categories?: Category[];
  stock?: Stock;
  averageRating?: number;
  numberOfReviews?: number;
  classifications?: ClassificationFeature[];
  url?: string;
}

export interface FacetValue {
  name: string;
  code?: string;
  count: number;
  selected: boolean;
  query?: {
    query: {
      value: string;
    };
  };
}

export interface Facet {
  name: string;
  code: string;
  values: FacetValue[];
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
  sort?: string;
}

export interface ProductSearchPage {
  products: Product[];
  pagination: Pagination;
  facets?: Facet[];
  freeTextSearch?: string;
}

export interface SearchQuery {
  query?: string;
  currentPage?: number;
  pageSize?: number;
  sort?: string;
  categoryCode?: string;
  selectedFacets?: Record<string, string[]>;
  baseSiteId?: string;
}
