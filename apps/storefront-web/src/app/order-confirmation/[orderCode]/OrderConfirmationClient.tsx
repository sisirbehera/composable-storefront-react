'use client';

import React, { useEffect, useState } from 'react';
import { Order } from '@storefront/core';
import { getAdapterFactory } from '@storefront/api';
import { Badge, Button, PriceTag } from '@storefront/ui';

export interface OrderConfirmationClientProps {
  orderCode: string;
  initialOrder?: Order | null;
}

export const OrderConfirmationClient: React.FC<OrderConfirmationClientProps> = ({
  orderCode,
  initialOrder,
}) => {
  const [order, setOrder] = useState<Order | null>(initialOrder || null);
  const [loading, setLoading] = useState<boolean>(!initialOrder);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const factory = getAdapterFactory();
        const loadedOrder = await factory.getCheckoutAdapter().getOrder(orderCode);
        if (loadedOrder) {
          setOrder(loadedOrder);
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderCode]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h1>
        <p className="text-slate-500 mb-6">Could not find details for order: {orderCode}</p>
        <Button href="/" variant="primary">Return to Home</Button>
      </div>
    );
  }

  const hasDiscount = order.totalDiscounts && order.totalDiscounts.value > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 1. Success Hero Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center mb-8 shadow-sm">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-md">
          ✓
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
          We&apos;ve sent an order confirmation and receipt to your email address.
        </p>

        <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm font-mono text-xs">
          <div>
            <span className="text-slate-400 uppercase tracking-wider">Order Number:</span>{' '}
            <span className="font-bold text-slate-900 text-sm">{order.code}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">|</span>
          <div>
            <span className="text-slate-400 uppercase tracking-wider">Status:</span>{' '}
            <Badge variant="success">{order.status}</Badge>
          </div>
        </div>
      </div>

      {/* 2. Order Metadata & Shipping Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Shipping Address */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Shipping Address
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed font-medium">
            <p className="font-bold text-slate-900">{order.deliveryAddress.firstName} {order.deliveryAddress.lastName}</p>
            <p>{order.deliveryAddress.line1}</p>
            {order.deliveryAddress.line2 && <p>{order.deliveryAddress.line2}</p>}
            <p>{order.deliveryAddress.city}, {order.deliveryAddress.postalCode}</p>
            <p>{order.deliveryAddress.country}</p>
            {order.deliveryAddress.phone && (
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
            <p className="font-bold text-slate-900">{order.deliveryMode.name}</p>
            {order.deliveryMode.estimatedDelivery && (
              <p className="text-emerald-600 mt-1 font-semibold">
                Est: {order.deliveryMode.estimatedDelivery}
              </p>
            )}
            <p className="text-slate-400 mt-2">
              Shipping Fee: {order.deliveryCost?.value === 0 ? 'FREE' : order.deliveryCost?.formattedValue}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Payment Method
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed font-medium">
            <p className="font-bold text-slate-900">{order.paymentDetails.cardType} Card</p>
            <p className="font-mono text-slate-600 mt-1">{order.paymentDetails.cardNumber}</p>
            <p className="text-slate-400 mt-1">
              Token: <span className="font-mono text-[10px] text-slate-500">{order.paymentDetails.token?.substring(0, 14)}...</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Line Items & Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
          Order Items ({order.totalItems})
        </h3>

        <div className="divide-y divide-slate-100 mb-6">
          {order.entries.map((entry) => (
            <div key={entry.entryNumber} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={entry.product.images?.[0]?.url}
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

      {/* 4. Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button href="/" variant="primary" size="lg">
          Continue Shopping &rarr;
        </Button>
      </div>
    </div>
  );
};
