'use client';

import React from 'react';
import { Address, DeliveryMode, OrderEntry, PaymentDetails, Price } from '@storefront/core';
import { Button } from '../atoms/Button';
import { PriceTag } from '../atoms/PriceTag';

export interface CheckoutReviewProps {
  deliveryAddress?: Address;
  deliveryMode?: DeliveryMode;
  paymentDetails?: PaymentDetails;
  entries: OrderEntry[];
  subTotal?: Price;
  totalDiscounts?: Price;
  deliveryCost?: Price;
  totalTax?: Price;
  totalPrice?: Price;
  onEditStep: (stepId: number) => void;
  onPlaceOrder: () => void;
  isPlacingOrder?: boolean;
}

export const CheckoutReview: React.FC<CheckoutReviewProps> = ({
  deliveryAddress,
  deliveryMode,
  paymentDetails,
  entries,
  subTotal,
  totalDiscounts,
  deliveryCost,
  totalTax,
  totalPrice,
  onEditStep,
  onPlaceOrder,
  isPlacingOrder = false,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Delivery & Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shipping Address */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Shipping Address
              </h4>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Edit
              </button>
            </div>
            {deliveryAddress ? (
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900">{deliveryAddress.firstName} {deliveryAddress.lastName}</p>
                <p>{deliveryAddress.line1}</p>
                {deliveryAddress.line2 && <p>{deliveryAddress.line2}</p>}
                <p>{deliveryAddress.city}, {deliveryAddress.postalCode}</p>
                <p>{deliveryAddress.country}</p>
              </div>
            ) : (
              <p className="text-xs text-rose-500">No address selected</p>
            )}
          </div>
        </div>

        {/* Shipping Method */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Shipping Method
              </h4>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Edit
              </button>
            </div>
            {deliveryMode ? (
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900">{deliveryMode.name}</p>
                <p className="text-slate-500">{deliveryMode.description}</p>
                <p className="text-emerald-600 font-semibold mt-1">
                  Cost: {deliveryMode.deliveryCost?.value === 0 ? 'FREE' : deliveryMode.deliveryCost?.formattedValue}
                </p>
              </div>
            ) : (
              <p className="text-xs text-rose-500">No delivery mode selected</p>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Payment Details
              </h4>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Edit
              </button>
            </div>
            {paymentDetails ? (
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900">{paymentDetails.cardType} Card</p>
                <p className="font-mono text-slate-600">{paymentDetails.cardNumber}</p>
                <p className="text-slate-400">Expires: {paymentDetails.expiryMonth}/{paymentDetails.expiryYear}</p>
              </div>
            ) : (
              <p className="text-xs text-rose-500">No payment details provided</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Order Line Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Items in Order ({entries.length})
        </h4>

        <div className="divide-y divide-slate-100">
          {entries.map((entry) => (
            <div key={entry.entryNumber} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <img
                  src={entry.product.images?.[0]?.url}
                  alt={entry.product.name}
                  className="w-12 h-12 rounded object-cover bg-slate-100"
                />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{entry.product.name}</p>
                  <p className="text-slate-400 mt-0.5">SKU: {entry.product.code} | Qty: {entry.quantity}</p>
                </div>
              </div>
              <PriceTag price={entry.totalPrice} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Place Order Action Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500">Final Order Total (includes shipping & tax):</div>
          <PriceTag price={totalPrice} size="lg" />
        </div>

        <Button
          size="lg"
          variant="primary"
          isLoading={isPlacingOrder}
          onClick={onPlaceOrder}
          className="w-full sm:w-auto px-8"
        >
          Place Order & Pay &rarr;
        </Button>
      </div>
    </div>
  );
};
