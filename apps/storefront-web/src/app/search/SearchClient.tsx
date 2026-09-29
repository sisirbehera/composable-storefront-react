'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductSearchPage, Product } from '@storefront/core';
import {
  FacetGroup,
  ActiveFilters,
  ActiveFilterItem,
  SortSelector,
  Pagination,
  ProductCard,
  Button,
  useSiteContext,
  useCartStore,
} from '@storefront/ui';
import { getAdapterFactory } from '@storefront/api';

export interface SearchClientProps {
  initialSearchData: ProductSearchPage;
  queryTerm?: string;
  categoryCode?: string;
}

export const SearchClient: React.FC<SearchClientProps> = ({
  initialSearchData,
  queryTerm,
  categoryCode,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeSite } = useSiteContext();
  const { addToCart } = useCartStore();

  const { products, pagination, facets } = initialSearchData;

  // Build active filter items for chips
  const activeFilterItems: ActiveFilterItem[] = [];
  if (facets) {
    facets.forEach((facet) => {
      facet.values.forEach((val) => {
        if (val.selected) {
          activeFilterItems.push({
            facetCode: facet.code,
            facetName: facet.name,
            valueCode: val.code || val.name,
            valueName: val.name,
          });
        }
      });
    });
  }

  const updateSearchUrl = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    // Reset page to 0 on any filter/sort change unless explicitly changing page
    router.push(`?${params.toString()}`);
  };

  const handleToggleFacet = (facetCode: string, valueCode: string) => {
    updateSearchUrl((params) => {
      const currentValues = params.getAll(facetCode);
      params.delete(facetCode);

      if (currentValues.includes(valueCode)) {
        // Remove it
        currentValues.filter((v) => v !== valueCode).forEach((v) => params.append(facetCode, v));
      } else {
        // Add it
        currentValues.forEach((v) => params.append(facetCode, v));
        params.append(facetCode, valueCode);
      }
      params.delete('page'); // Reset to page 0
    });
  };

  const handleRemoveFilter = (facetCode: string, valueCode: string) => {
    updateSearchUrl((params) => {
      const currentValues = params.getAll(facetCode);
      params.delete(facetCode);
      currentValues.filter((v) => v !== valueCode).forEach((v) => params.append(facetCode, v));
      params.delete('page');
    });
  };

  const handleClearAll = () => {
    updateSearchUrl((params) => {
      if (facets) {
        facets.forEach((f) => params.delete(f.code));
      }
      params.delete('page');
    });
  };

  const handleSortChange = (newSort: string) => {
    updateSearchUrl((params) => {
      params.set('sort', newSort);
      params.delete('page');
    });
  };

  const handlePageChange = (newPage: number) => {
    updateSearchUrl((params) => {
      params.set('page', String(newPage));
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product.code, 1, activeSite.uid, true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Stats */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {categoryCode ? (
            <span className="capitalize">{categoryCode} Collection</span>
          ) : queryTerm ? (
            <span>Search results for &ldquo;{queryTerm}&rdquo;</span>
          ) : (
            <span>All Products</span>
          )}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Showing {products.length} of {pagination.totalResults} products
        </p>
      </div>

      {/* Active Filter Chips */}
      <ActiveFilters
        filters={activeFilterItems}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Facets */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
              <h2 className="text-base font-bold text-slate-900">Filters</h2>
              {activeFilterItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  Reset ({activeFilterItems.length})
                </button>
              )}
            </div>

            {facets && facets.length > 0 ? (
              facets.map((facet) => (
                <FacetGroup
                  key={facet.code}
                  facet={facet}
                  onToggleFacet={handleToggleFacet}
                  defaultExpanded={true}
                />
              ))
            ) : (
              <div className="text-xs text-slate-400 py-4">No filters available</div>
            )}
          </div>
        </aside>

        {/* Right Main Column: Controls & Product Grid */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <div>
            {/* Top Toolbar */}
            <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-medium text-slate-600">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>

              <SortSelector
                currentSort={pagination.sort || 'relevance'}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No matching products found</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
                  Try clearing some of your selected filters or searching with different keywords.
                </p>
                {activeFilterItems.length > 0 && (
                  <Button variant="primary" size="sm" onClick={handleClearAll}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.code}
                    product={product}
                    onSelect={(p) => router.push(`/products/${p.code}`)}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Numbered Pagination */}
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};
