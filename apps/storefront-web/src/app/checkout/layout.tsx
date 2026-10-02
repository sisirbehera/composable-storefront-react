'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CheckoutProvider, useCheckout } from './CheckoutContext';
import { CheckoutStepper } from '@storefront/ui';

function CheckoutShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, loading, errorMsg } = useCheckout();

  // Determine current step index from route
  const getStepIdFromPath = (path: string): number => {
    if (path.includes('/shipping-address')) return 1;
    if (path.includes('/delivery-mode')) return 2;
    if (path.includes('/payment-details')) return 3;
    if (path.includes('/review-order')) return 4;
    return 1;
  };

  const currentStep = getStepIdFromPath(pathname);

  const handleStepClick = (stepId: number) => {
    const routeMap: Record<number, string> = {
      1: '/checkout/shipping-address',
      2: '/checkout/delivery-mode',
      3: '/checkout/payment-details',
      4: '/checkout/review-order',
    };
    if (routeMap[stepId]) {
      router.push(routeMap[stepId]);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500 dark:text-slate-400">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-xs">Initializing checkout...</p>
      </div>
    );
  }

  if (!cart || cart.entries.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complete your purchase in 4 easy steps.
        </p>
      </div>

      <CheckoutStepper
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-400 font-medium">
          ✕ {errorMsg}
        </div>
      )}

      {children}
    </div>
  );
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <CheckoutProvider>
      <CheckoutShell>{children}</CheckoutShell>
    </CheckoutProvider>
  );
}
