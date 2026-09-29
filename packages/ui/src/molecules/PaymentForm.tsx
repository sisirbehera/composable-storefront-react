'use client';

import React, { useState } from 'react';
import { PaymentDetails } from '@storefront/core';
import { Button } from '../atoms/Button';

export interface PaymentFormProps {
  onSubmit: (payment: PaymentDetails) => void;
  isLoading?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [accountHolderName, setAccountHolderName] = useState('Alex Morgan');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiryMonth, setExpiryMonth] = useState('12');
  const [expiryYear, setExpiryYear] = useState('2028');
  const [cvv, setCvv] = useState('123');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const detectCardType = (num: string): 'Visa' | 'Mastercard' | 'Amex' | 'Discover' => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('3')) return 'Amex';
    return 'Discover';
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 16);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!accountHolderName.trim()) errs.accountHolderName = 'Cardholder name is required';
    if (cardNumber.replace(/\s+/g, '').length < 15) errs.cardNumber = 'Valid 15-16 digit card number is required';
    if (!cvv || cvv.length < 3) errs.cvv = 'Valid CVV is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    onSubmit({
      accountHolderName,
      cardNumber: cardNumber.replace(/\s+/g, ''),
      cardType: detectCardType(cardNumber),
      expiryMonth,
      expiryYear,
      cvv,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900">Payment Information</h3>
        <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
          {detectCardType(cardNumber)}
        </span>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Name on Card *</label>
        <input
          type="text"
          value={accountHolderName}
          onChange={(e) => setAccountHolderName(e.target.value)}
          className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.accountHolderName ? 'border-rose-400' : 'border-slate-200'
          }`}
          placeholder="Alex Morgan"
        />
        {errors.accountHolderName && <span className="text-[10px] text-rose-500 mt-0.5">{errors.accountHolderName}</span>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number *</label>
        <input
          type="text"
          maxLength={19}
          value={cardNumber}
          onChange={handleCardNumberChange}
          className={`w-full text-xs font-mono p-2.5 rounded-lg border bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.cardNumber ? 'border-rose-400' : 'border-slate-200'
          }`}
          placeholder="4111 2222 3333 4444"
        />
        {errors.cardNumber && <span className="text-[10px] text-rose-500 mt-0.5">{errors.cardNumber}</span>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Exp. Month *</label>
          <select
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Exp. Year *</label>
          <select
            value={expiryYear}
            onChange={(e) => setExpiryYear(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['2025', '2026', '2027', '2028', '2029', '2030'].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Security Code (CVV) *</label>
          <input
            type="password"
            maxLength={4}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
            className={`w-full text-xs font-mono p-2.5 rounded-lg border bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cvv ? 'border-rose-400' : 'border-slate-200'
            }`}
            placeholder="123"
          />
          {errors.cvv && <span className="text-[10px] text-rose-500 mt-0.5">{errors.cvv}</span>}
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span>Billing address is the same as delivery address</span>
        </label>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
          Continue to Review &rarr;
        </Button>
      </div>
    </form>
  );
};
