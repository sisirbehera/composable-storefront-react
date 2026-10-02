'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PaymentForm } from '@storefront/ui';
import { PaymentDetails } from '@storefront/core';
import { useCheckout } from '../CheckoutContext';

export default function PaymentDetailsStepPage() {
  const router = useRouter();
  const { handleConfirmPayment } = useCheckout();

  const onSubmitPayment = async (payment: PaymentDetails) => {
    const success = await handleConfirmPayment(payment);
    if (success) {
      router.push('/checkout/review-order');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          3. Payment Details
        </h2>
        <button
          type="button"
          onClick={() => router.push('/checkout/delivery-mode')}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
        >
          ← Edit Delivery
        </button>
      </div>

      <PaymentForm onSubmit={onSubmitPayment} />
    </div>
  );
}
