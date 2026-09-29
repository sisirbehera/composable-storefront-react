'use client';

import React from 'react';
import { Product } from '@storefront/core';
import { PriceTag } from '../atoms/PriceTag';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelect,
}) => {
  const primaryImage =
    product.images?.find((img) => img.imageType === 'PRIMARY' && img.format === 'product') ||
    product.images?.[0];

  const inStock = product.stock?.stockLevelStatus === 'inStock';

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div
          className="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer relative"
          onClick={() => onSelect?.(product)}
        >
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
              No Image
            </div>
          )}

          <div className="absolute top-2 right-2">
            <Badge variant={inStock ? 'success' : 'danger'}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {product.categories?.[0]?.name || product.code}
          </div>
          <h3
            className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-2"
            onClick={() => onSelect?.(product)}
          >
            {product.name}
          </h3>

          {product.averageRating && (
            <div className="flex items-center mt-1.5 space-x-1">
              <span className="text-amber-400 text-sm">★</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.averageRating.toFixed(1)}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">({product.numberOfReviews || 0})</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between">
        <PriceTag price={product.price} size="md" />
        <Button
          size="sm"
          variant="primary"
          disabled={!inStock}
          onClick={() => onAddToCart?.(product)}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
