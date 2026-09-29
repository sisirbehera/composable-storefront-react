'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, PriceTag, CouponInput, useTranslation, useSiteContext, useCartStore } from '@storefront/ui';
import { Outlet } from '@storefront/cms';

export default function CartPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { activeSite } = useSiteContext();
  const {
    cart,
    isLoading: loading,
    loadCart,
    updateEntry,
    removeEntry,
    applyCoupon,
    removeCoupon,
    resetCart,
  } = useCartStore();

  useEffect(() => {
    loadCart(activeSite.uid);
  }, [activeSite.uid, loadCart]);

  const handleUpdate = async (entryNumber: number, newQty: number) => {
    await updateEntry(entryNumber, newQty, activeSite.uid);
  };

  const handleRemove = async (entryNumber: number) => {
    await removeEntry(entryNumber, activeSite.uid);
  };

  const handleApplyCoupon = async (code: string) => {
    await applyCoupon(code, activeSite.uid);
  };

  const handleRemoveCoupon = async (code: string) => {
    await removeCoupon(code, activeSite.uid);
  };

  const handleResetDemoCart = async () => {
    await resetCart(activeSite.uid);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading cart...
      </div>
    );
  }

  if (!cart || !cart.entries || cart.entries.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{t('cart.emptyCart')}</h1>
        <p className="text-slate-500 mb-6">{t('cart.emptyCartMsg')}</p>
        <div className="flex items-center justify-center space-x-3">
          <Button href="/search" variant="primary">{t('cart.continueShopping')}</Button>
          <Button variant="outline" onClick={handleResetDemoCart}>{t('cart.loadSampleItems')}</Button>
        </div>
      </div>
    );
  }

  const hasDiscount = cart.totalDiscounts && cart.totalDiscounts.value > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
        {t('cart.cartTitle')} ({cart.totalItems ?? cart.entries.reduce((sum, e) => sum + e.quantity, 0)} {t('product.qty').toLowerCase()})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Entries List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.entries.map((entry) => (
            <div
              key={entry.entryNumber}
              className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={entry.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80'}
                  alt={entry.product?.name || 'Product'}
                  className="w-20 h-20 object-cover rounded-lg bg-slate-100"
                />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                    {entry.product?.name || 'Product'}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">SKU: {entry.product?.code}</div>
                  <PriceTag price={entry.basePrice} size="sm" className="mt-2 block" />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 cursor-pointer"
                    onClick={() => handleUpdate(entry.entryNumber, entry.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold">{entry.quantity}</span>
                  <button
                    type="button"
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 cursor-pointer"
                    onClick={() => handleUpdate(entry.entryNumber, entry.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(entry.entryNumber)}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-700 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
          <Outlet name="Cart.Summary" context={{ cart }}>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            <div className="flex justify-between text-sm text-slate-600">
              <span>{t('cart.subtotal')}</span>
              <PriceTag price={cart.subTotal} size="sm" />
            </div>

            {hasDiscount && (
              <div className="flex justify-between text-sm text-emerald-600 font-medium">
                <span>Discounts Applied</span>
                <span>{cart.totalDiscounts?.formattedValue}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-slate-600">
              <span>{t('cart.delivery')}</span>
              <span className={cart.deliveryCost?.value === 0 ? 'text-emerald-600 font-semibold' : ''}>
                {cart.deliveryCost?.formattedValue || 'Free'}
              </span>
            </div>

            {cart.totalTax && cart.totalTax.value > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t('cart.tax')}</span>
                <PriceTag price={cart.totalTax} size="sm" />
              </div>
            )}

            <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
              <span className="text-base font-bold text-slate-900">{t('cart.total')}</span>
              <PriceTag price={cart.totalPrice} size="lg" />
            </div>

            {/* Coupon / Voucher Input */}
            <CouponInput
              appliedVouchers={cart.appliedVouchers || []}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />

            <Button
              size="lg"
              variant="primary"
              className="w-full"
              href="/checkout"
            >
              {t('cart.checkout')} &rarr;
            </Button>
          </Outlet>
        </div>
      </div>
    </div>
  );
}
