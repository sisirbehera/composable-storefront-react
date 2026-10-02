'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutReview } from '@storefront/ui';
import { useCheckout } from '../CheckoutContext';

export default function ReviewOrderStepPage() {
  const router = useRouter();
  const {
    cart,
    selectedAddress,
    paymentDetails,
    handlePlaceOrder,
    isPlacingOrder,
  } = useCheckout();

  if (!cart) {
    return null;
  }

  const handleEditStep = (stepId: number) => {
    const routeMap: Record<number, string> = {
      1: '/checkout/shipping-address',
      2: '/checkout/delivery-mode',
      3: '/checkout/payment-details',
    };
    if (routeMap[stepId]) {
      router.push(routeMap[stepId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          4. Review Your Order
        </h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Please review all information before clicking Place Order.
        </span>
      </div>

      <CheckoutReview
        deliveryAddress={cart.deliveryAddress || selectedAddress || undefined}
        deliveryMode={cart.deliveryMode}
        paymentDetails={cart.paymentDetails || paymentDetails || undefined}
        entries={cart.entries}
        subTotal={cart.subTotal}
        totalDiscounts={cart.totalDiscounts}
        deliveryCost={cart.deliveryCost}
        totalTax={cart.totalTax}
        totalPrice={cart.totalPrice}
        onEditStep={handleEditStep}
        onPlaceOrder={handlePlaceOrder}
        isPlacingOrder={isPlacingOrder}
      />
    </div>
  );
}
