import React from 'react';
import { notFound } from 'next/navigation';
import { getAdapterFactory } from '@storefront/api';
import { appConfig } from '@/config/storefront.config';
import { Badge, PriceTag } from '@storefront/ui';
import { Outlet } from '@storefront/cms';
import { AddToCartButton } from './AddToCartButton';

interface ProductPageProps {
  params: Promise<{
    code: string;
  }>;
  searchParams?: Promise<{
    site?: string;
  }>;
}

export default async function ProductDetailsPage({ params, searchParams }: ProductPageProps) {
  const { code } = await params;
  const sParams = searchParams ? await searchParams : {};
  const siteParam = sParams.site ? `?site=${sParams.site}` : '';
  const factory = getAdapterFactory(appConfig);
  const productAdapter = factory.getProductAdapter();
  const product = await productAdapter.getProduct(code);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.images?.find((img) => img.imageType === 'PRIMARY' && img.format === 'product') ||
    product.images?.[0];

  const inStock = product.stock?.stockLevelStatus === 'inStock';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
        <a href={`/${siteParam}`} className="hover:text-blue-600">Home</a>
        <span>/</span>
        <a href={`/search${siteParam}`} className="hover:text-blue-600">Products</a>
        <span>/</span>
        <span className="font-semibold text-slate-800">{product.code}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Media Gallery */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center aspect-square">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-slate-400">No Image Available</div>
          )}
        </div>

        {/* Product Info & Purchase Action */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                SKU: {product.code}
              </span>
              <Badge variant={inStock ? 'success' : 'danger'}>
                {inStock ? `In Stock (${product.stock?.stockLevel || 'Available'})` : 'Out of Stock'}
              </Badge>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              {product.name}
            </h1>

            {product.averageRating && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-amber-400 text-sm">
                  {'★'.repeat(Math.floor(product.averageRating))}
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">
                  ({product.numberOfReviews} customer reviews)
                </span>
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-xl mb-6 border border-slate-200">
              <PriceTag price={product.price} size="lg" />
              <div className="text-xs text-slate-500 mt-1">
                Taxes calculated during checkout. Free standard shipping available.
              </div>
            </div>

            <Outlet name="ProductDetails.Summary" context={{ product }}>
              {product.summary && (
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {product.summary}
                </p>
              )}
            </Outlet>

            <Outlet name="ProductDetails.Actions" context={{ product }}>
              <AddToCartButton productCode={product.code} disabled={!inStock} />
            </Outlet>
          </div>

          {/* Specifications / Classifications */}
          {product.classifications && product.classifications.length > 0 && (
            <div className="mt-10 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Technical Specifications
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {product.classifications.map((feature) => (
                  <div key={feature.code} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <dt className="text-slate-500 font-medium">{feature.name}</dt>
                    <dd className="text-slate-900 font-semibold mt-0.5">{feature.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
