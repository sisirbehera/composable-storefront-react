'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCartStore } from '../store/useCartStore';
import { useSiteContext } from '../context/SiteContext';
import { PriceTag } from '../atoms/PriceTag';
import { Button } from '../atoms/Button';

export interface MiniCartDrawerProps {
  onNavigateCart?: () => void;
  onNavigateCheckout?: () => void;
}

export const MiniCartDrawer: React.FC<MiniCartDrawerProps> = ({
  onNavigateCart,
  onNavigateCheckout,
}) => {
  const [mounted, setMounted] = useState(false);
  const { cart, totalItems, isMiniCartOpen, closeMiniCart, updateEntry, removeEntry, isLoading } =
    useCartStore();
  const { activeSite, t } = useSiteContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key when open
  useEffect(() => {
    if (!isMiniCartOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMiniCart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMiniCartOpen, closeMiniCart]);

  if (!isMiniCartOpen || !mounted) return null;

  const entries = cart?.entries || [];
  const subtotalVal = cart?.subTotal?.value || 0;
  const currencyIso = cart?.subTotal?.currencyIso || activeSite.defaultCurrency || 'USD';
  const currencySymbol = currencyIso === 'EUR' ? '€' : currencyIso === 'GBP' ? '£' : currencyIso === 'JPY' ? '¥' : '$';

  // Free shipping threshold logic ($150 / €140 / £120 / ¥20,000)
  const shippingThreshold =
    currencyIso === 'EUR' ? 140 : currencyIso === 'GBP' ? 120 : currencyIso === 'JPY' ? 20000 : 150;
  const progressPercent = Math.min(100, Math.round((subtotalVal / shippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotalVal);

  const handleGoToCart = () => {
    closeMiniCart();
    if (onNavigateCart) {
      onNavigateCart();
    } else if (typeof window !== 'undefined') {
      window.location.href = `/cart?site=${activeSite.uid}`;
    }
  };

  const handleGoToCheckout = () => {
    closeMiniCart();
    if (onNavigateCheckout) {
      onNavigateCheckout();
    } else if (typeof window !== 'undefined') {
      window.location.href = `/checkout?site=${activeSite.uid}`;
    }
  };

  const handleProductClick = (code: string) => {
    closeMiniCart();
    if (typeof window !== 'undefined') {
      window.location.href = `/products/${code}?site=${activeSite.uid}`;
    }
  };

  const drawerContent = (
    <div className="fixed inset-0 z-[90] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="mini-cart-title">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={closeMiniCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-slide-left text-slate-900 dark:text-slate-100">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/90 backdrop-blur-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shadow-sm">
                🛒
              </div>
              <div>
                <h2 id="mini-cart-title" className="text-base font-bold text-slate-900 dark:text-white">
                  {t('cart.cartTitle')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeMiniCart}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close cart"
              title="Close (Esc)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {entries.length > 0 && (
            <div className="bg-blue-50/60 dark:bg-blue-950/30 px-6 py-2.5 border-b border-blue-100/70 dark:border-blue-900/30 text-xs">
              <div className="flex items-center justify-between font-semibold mb-1">
                {progressPercent >= 100 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                    <span>🎉</span>
                    <span>Free Express Delivery unlocked!</span>
                  </span>
                ) : (
                  <span className="text-slate-700 dark:text-slate-300">
                    Add{' '}
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {currencySymbol}
                      {remainingForFreeShipping.toFixed(currencyIso === 'JPY' ? 0 : 2)}
                    </span>{' '}
                    more for <span className="font-bold text-blue-700 dark:text-blue-400">Free Delivery</span>
                  </span>
                )}
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100 dark:divide-slate-800">
            {entries.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-4 text-3xl shadow-inner">
                  🛍️
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('cart.emptyCart')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                  Your shopping bag is currently empty. Explore our catalog and add items to your cart.
                </p>
                <button
                  type="button"
                  onClick={closeMiniCart}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Start Shopping &rarr;
                </button>
              </div>
            ) : (
              entries.map((entry) => {
                const img =
                  entry.product.images?.find(
                    (i) => i.imageType === 'PRIMARY' && (i.format === 'thumbnail' || i.format === 'product')
                  ) || entry.product.images?.[0];

                return (
                  <div key={entry.entryNumber} className="py-4 flex items-start space-x-3.5 group">
                    {/* Fixed Size Thumbnail Container */}
                    <div
                      onClick={() => handleProductClick(entry.product.code)}
                      className="w-20 h-20 shrink-0 bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700 p-1 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                      title={entry.product.name}
                    >
                      {img?.url ? (
                        <img
                          src={img.url}
                          alt={img.altText || entry.product.name}
                          className="w-full h-full object-contain object-center"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 text-2xl">📦</span>
                      )}
                    </div>

                    {/* Product Details & Actions */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                      <div>
                        {/* Brand & Category Tag */}
                        <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                          {entry.product.brand && (
                            <span className="text-blue-600 dark:text-blue-400 truncate max-w-[120px]">
                              {entry.product.brand}
                            </span>
                          )}
                          <span className="font-mono text-slate-400 dark:text-slate-500">SKU: {entry.product.code}</span>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => handleProductClick(entry.product.code)}
                          className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer mt-0.5"
                          title={entry.product.name}
                        >
                          {entry.product.name}
                        </h4>
                      </div>

                      {/* Quantity Stepper & Price Row */}
                      <div className="flex items-center justify-between mt-2.5 pt-1">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-xs">
                          <button
                            type="button"
                            className="w-7 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 cursor-pointer text-sm font-bold"
                            disabled={isLoading}
                            onClick={() =>
                              updateEntry(entry.entryNumber, Math.max(0, entry.quantity - 1), activeSite.uid)
                            }
                            title="Decrease quantity"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-slate-100 select-none">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            className="w-7 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 cursor-pointer text-sm font-bold"
                            disabled={isLoading}
                            onClick={() =>
                              updateEntry(entry.entryNumber, entry.quantity + 1, activeSite.uid)
                            }
                            title="Increase quantity"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Item Pricing & Delete */}
                        <div className="flex items-center space-x-2.5">
                          <div className="text-right">
                            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              <PriceTag price={entry.totalPrice} size="sm" />
                            </div>
                            {entry.quantity > 1 && entry.basePrice && (
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                {entry.basePrice.formattedValue || `$${entry.basePrice.value.toFixed(2)}`} each
                              </div>
                            )}
                          </div>

                          {/* Delete Trash Button */}
                          <button
                            type="button"
                            onClick={() => removeEntry(entry.entryNumber, activeSite.uid)}
                            disabled={isLoading}
                            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & CTAs */}
          {entries.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xs space-y-3.5">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between items-center">
                  <span>{t('cart.subtotal')}</span>
                  <PriceTag price={cart?.subTotal} size="sm" />
                </div>

                {cart?.totalDiscounts && cart.totalDiscounts.value > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="flex items-center space-x-1">
                      <span>🏷️</span>
                      <span>Discounts applied</span>
                    </span>
                    <span>-{cart.totalDiscounts.formattedValue}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>{t('cart.total')}</span>
                  <PriceTag price={cart?.totalPrice} size="md" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button variant="outline" size="md" onClick={handleGoToCart} className="w-full">
                  {t('cart.cartTitle')}
                </Button>
                <Button variant="primary" size="md" onClick={handleGoToCheckout} className="w-full">
                  {t('cart.checkout')} &rarr;
                </Button>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  🔒 Encrypted 256-bit SSL Checkout &bull; Free Returns
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
