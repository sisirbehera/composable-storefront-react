import React from 'react';
import { getAdapterFactory } from '@storefront/api';
import { appConfig } from '@/config/storefront.config';
import { SearchClient } from './SearchClient';

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
    brand?: string | string[];
    category?: string | string[];
    price?: string | string[];
    stock?: string | string[];
    sort?: string;
    page?: string;
    site?: string;
    lang?: string;
    curr?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const factory = getAdapterFactory(appConfig);
  const productAdapter = factory.getProductAdapter();

  const toArray = (val?: string | string[]) => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  const selectedFacets: Record<string, string[]> = {};
  const brands = toArray(params.brand);
  if (brands.length > 0) selectedFacets['brand'] = brands;

  const categories = toArray(params.category);
  if (categories.length > 0) selectedFacets['category'] = categories;

  const prices = toArray(params.price);
  if (prices.length > 0) selectedFacets['price'] = prices;

  const stocks = toArray(params.stock);
  if (stocks.length > 0) selectedFacets['stock'] = stocks;

  const currentPage = params.page ? parseInt(params.page, 10) : 0;
  const sort = params.sort || 'relevance';

  const searchData = await productAdapter.searchProducts({
    query: params.query,
    sort,
    currentPage,
    pageSize: 6,
    selectedFacets,
    baseSiteId: params.site,
  });

  return (
    <React.Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">Loading products...</div>}>
      <SearchClient
        initialSearchData={searchData}
        queryTerm={params.query}
      />
    </React.Suspense>
  );
}
