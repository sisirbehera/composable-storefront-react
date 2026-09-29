'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@storefront/core';
import { getAdapterFactory } from '@storefront/api';
import { useAuth } from '@storefront/auth';
import { appConfig } from '@/config/storefront.config';
import { Badge, Button, PriceTag } from '@storefront/ui';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { authState } = useAuth();
  const orderCode = params.orderCode as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderCode) return;
      setLoading(true);
      try {
        const factory = getAdapterFactory(appConfig);
        const userAdapter = factory.getUserAdapter();
        const userId = authState.user?.uid || 'current';

        let loaded = await userAdapter.getOrderDetails(userId, orderCode);
        if (!loaded) {
          // Fallback to checkout adapter
          loaded = await factory.getCheckoutAdapter().getOrder(orderCode);
        }
        setOrder(loaded);
      } catch (err) {
        console.error('Failed to load order receipt:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderCode, authState.user?.uid]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm animate-pulse">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-medium">Loading order details & receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Order Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">
          Could not find details for order: <strong className="font-mono">{orderCode}</strong>
        </p>
        <button
          type="button"
          onClick={() => router.push('/my-account/orders')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          &larr; Back to Order History
        </button>
      </div>
    );
  }

  const hasDiscount = order.totalDiscounts && order.totalDiscounts.value > 0;

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <button
            type="button"
            onClick={() => router.push('/my-account/orders')}
            className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:underline mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Order History</span>
          </button>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-black text-slate-900 font-mono">{order.code}</h2>
            <Badge variant="success">{order.status}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Placed on {order.created ? new Date(order.created).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }) : 'Recent'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Address */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Shipping Address
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed font-medium">
            <p className="font-bold text-slate-900">
              {order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}
            </p>
            <p>{order.deliveryAddress?.line1}</p>
            {order.deliveryAddress?.line2 && <p>{order.deliveryAddress?.line2}</p>}
            <p>
              {order.deliveryAddress?.city}, {order.deliveryAddress?.postalCode}
            </p>
            <p>{order.deliveryAddress?.country}</p>
            {order.deliveryAddress?.phone && (
              <p className="text-slate-400 mt-2 font-mono">{order.deliveryAddress.phone}</p>
            )}
          </div>
        </div>

        {/* Shipping Method */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Delivery Method
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed font-medium">
            <p className="font-bold text-slate-900">{order.deliveryMode?.name || 'Standard Shipping'}</p>
            {order.deliveryMode?.estimatedDelivery && (
              <p className="text-emerald-600 mt-1 font-semibold">
                Est: {order.deliveryMode.estimatedDelivery}
              </p>
            )}
            <p className="text-slate-400 mt-2">
              Shipping Fee: {order.deliveryCost?.value === 0 ? 'FREE' : order.deliveryCost?.formattedValue || '$0.00'}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Payment Details
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed font-medium">
            <p className="font-bold text-slate-900">{order.paymentDetails?.cardType || 'Credit'} Card</p>
            <p className="font-mono text-slate-600 mt-1">{order.paymentDetails?.cardNumber || '•••• 4242'}</p>
            <p className="text-slate-400 mt-1">
              Cardholder: {order.paymentDetails?.accountHolderName || 'Alex Morgan'}
            </p>
          </div>
        </div>
      </div>

      {/* Line Items & Totals */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
          Order Items ({order.totalItems || order.entries?.length || 0})
        </h3>

        <div className="divide-y divide-slate-100 mb-6">
          {(order.entries || []).map((entry) => (
            <div key={entry.entryNumber} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={entry.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                  alt={entry.product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-100"
                />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                    {entry.product.name}
                  </h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    SKU: {entry.product.code} | Qty: {entry.quantity}
                  </div>
                  <PriceTag price={entry.basePrice} size="sm" className="mt-1 block text-slate-600" />
                </div>
              </div>

              <div className="text-right">
                <PriceTag price={entry.totalPrice} size="md" />
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Totals Breakdown */}
        <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <PriceTag price={order.subTotal} size="sm" />
          </div>

          {hasDiscount && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discounts Applied</span>
              <span>{order.totalDiscounts?.formattedValue}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600">
            <span>Delivery</span>
            <span className={order.deliveryCost?.value === 0 ? 'text-emerald-600 font-semibold' : ''}>
              {order.deliveryCost?.formattedValue || 'Free'}
            </span>
          </div>

          {order.totalTax && (
            <div className="flex justify-between text-slate-600">
              <span>Estimated Taxes (8%)</span>
              <PriceTag price={order.totalTax} size="sm" />
            </div>
          )}

          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Total Paid</span>
            <PriceTag price={order.totalPrice} size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
