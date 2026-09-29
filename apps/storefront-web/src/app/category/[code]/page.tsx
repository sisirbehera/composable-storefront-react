import React from 'react';
import { getAdapterFactory } from '@storefront/api';
import { appConfig } from '@/config/storefront.config';
import { SearchClient } from '../../search/SearchClient';

interface CategoryPageProps {
  params: Promise<{
    code: string;
  }>;
  searchParams: Promise<{
    brand?: string | string[];
    price?: string | string[];
    stock?: string | string[];
    sort?: string;
    page?: string;
    site?: string;
    lang?: string;
    curr?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { code } = await params;
  const sParams = await searchParams;

  const factory = getAdapterFactory(appConfig);
  const productAdapter = factory.getProductAdapter();

  const toArray = (val?: string | string[]) => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  const selectedFacets: Record<string, string[]> = {};
  const brands = toArray(sParams.brand);
  if (brands.length > 0) selectedFacets['brand'] = brands;

  const prices = toArray(sParams.price);
  if (prices.length > 0) selectedFacets['price'] = prices;

  const stocks = toArray(sParams.stock);
  if (stocks.length > 0) selectedFacets['stock'] = stocks;

  const currentPage = sParams.page ? parseInt(sParams.page, 10) : 0;
  const sort = sParams.sort || 'relevance';

  const searchData = await productAdapter.searchProducts({
    categoryCode: code,
    sort,
    currentPage,
    pageSize: 6,
    selectedFacets,
    baseSiteId: sParams.site,
  });

  return (
    <React.Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">Loading products...</div>}>
      <SearchClient
        initialSearchData={searchData}
        categoryCode={code}
      />
    </React.Suspense>
  );
}
