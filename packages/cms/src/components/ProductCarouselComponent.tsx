'use client';

import React, { useEffect, useState } from 'react';
import { Product, ProductCarouselComponentProperties } from '@storefront/core';
import { getAdapterFactory } from '@storefront/api';
import { ProductCard, useSiteContext, useCartStore } from '@storefront/ui';

export interface ProductCarouselComponentProps {
  properties: ProductCarouselComponentProperties;
  products?: Product[];
}

export const ProductCarouselComponent: React.FC<ProductCarouselComponentProps> = ({
  properties,
  products: initialProducts,
}) => {
  const { activeSite } = useSiteContext();
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(!initialProducts);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;

    let isMounted = true;
    async function loadProducts() {
      setLoading(true);
      try {
        const productAdapter = getAdapterFactory().getProductAdapter();
        const codes = properties.productCodes || [];
        const loaded = await Promise.all(
          codes.map((code) => productAdapter.getProduct(code))
        );
        if (isMounted) {
          setProducts(loaded.filter((p): p is Product => p !== null));
        }
      } catch (err) {
        console.error('Failed to load products for carousel', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [properties.productCodes, initialProducts]);

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {properties.title || 'Featured Products'}
        </h2>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {products.length} Products
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-80 bg-slate-100 rounded-xl animate-pulse border border-slate-200"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl text-slate-500 text-sm">
          No products found in this carousel.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.code}
              product={product}
              onSelect={(p) => {
                if (typeof window !== 'undefined') {
                  window.location.href = `/products/${p.code}`;
                }
              }}
              onAddToCart={(p) => {
                addToCart(p.code, 1, activeSite.uid, true);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};
