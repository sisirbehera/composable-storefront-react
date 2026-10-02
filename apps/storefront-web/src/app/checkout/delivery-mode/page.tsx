'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DeliveryModeSelector, Button } from '@storefront/ui';
import { useCheckout } from '../CheckoutContext';

export default function DeliveryModeStepPage() {
  const router = useRouter();
  const {
    deliveryModes,
    selectedModeCode,
    setSelectedModeCode,
    handleConfirmDeliveryMode,
  } = useCheckout();

  const onContinue = async () => {
    const success = await handleConfirmDeliveryMode();
    if (success) {
      router.push('/checkout/payment-details');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          2. Choose Delivery Method
        </h2>
        <button
          type="button"
          onClick={() => router.push('/checkout/shipping-address')}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
        >
          ← Edit Address
        </button>
      </div>

      <DeliveryModeSelector
        modes={deliveryModes}
        selectedModeCode={selectedModeCode}
        onSelectMode={(code) => setSelectedModeCode(code)}
      />

      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push('/checkout/shipping-address')}
        >
          &larr; Back
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={onContinue}
        >
          Continue to Payment &rarr;
        </Button>
      </div>
    </div>
  );
}
