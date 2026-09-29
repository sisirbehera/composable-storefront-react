'use client';

import React, { useState } from 'react';
import { PaymentDetails } from '@storefront/core';
import { PaymentForm } from '../molecules/PaymentForm';

export interface PaymentMethodsGridProps {
  paymentMethods: PaymentDetails[];
  isLoading?: boolean;
  onAddPaymentMethod?: (payment: PaymentDetails) => Promise<void>;
  onDeletePaymentMethod: (paymentId: string) => Promise<void>;
}

export const PaymentMethodsGrid: React.FC<PaymentMethodsGridProps> = ({
  paymentMethods,
  isLoading = false,
  onAddPaymentMethod,
  onDeletePaymentMethod,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const getCardBrandBadge = (type?: string) => {
    const t = (type || 'Visa').toLowerCase();
    if (t.includes('master')) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Mastercard</span>;
    }
    if (t.includes('amex')) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Amex</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Visa</span>;
  };

  const maskCardNumber = (num?: string) => {
    if (!num) return '•••• •••• •••• ••••';
    const clean = num.replace(/\s+/g, '');
    const last4 = clean.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const handleAddPayment = async (payment: PaymentDetails) => {
    if (!onAddPaymentMethod) return;
    setActionLoading(true);
    try {
      await onAddPaymentMethod(payment);
      setShowAddForm(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payment Methods</h2>
          <p className="text-xs text-slate-500">Manage your saved credit & debit cards</p>
        </div>
        {!showAddForm && onAddPaymentMethod && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Payment Method</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-blue-100 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Add Credit / Debit Card</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
          <PaymentForm onSubmit={handleAddPayment} isLoading={actionLoading} />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
          <div className="h-40 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
        </div>
      ) : paymentMethods.length === 0 && !showAddForm ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Saved Cards</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Save a payment method for 1-click accelerated checkout.
          </p>
          {onAddPaymentMethod && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
            >
              Add Card Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id || method.cardNumber}
              className={`bg-white rounded-2xl border p-5 shadow-sm relative flex flex-col justify-between transition-all ${
                method.defaultPayment ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {getCardBrandBadge(method.cardType)}
                  {method.defaultPayment && (
                    <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                      Default Method
                    </span>
                  )}
                </div>

                <div className="font-mono text-base font-bold text-slate-800 tracking-wider mb-2">
                  {maskCardNumber(method.cardNumber)}
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Cardholder</span>
                    <span className="font-medium text-slate-700">{method.accountHolderName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Expires</span>
                    <span className="font-medium text-slate-700">{method.expiryMonth}/{method.expiryYear}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                {method.id && (
                  <button
                    type="button"
                    onClick={() => onDeletePaymentMethod(method.id!)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove Card
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
