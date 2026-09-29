import React from 'react';
import { CheckoutClient } from './CheckoutClient';

export const metadata = {
  title: 'Checkout | Composable Storefront',
  description: 'Secure multi-step checkout process.',
};

export default function CheckoutPage() {
  return (
    <React.Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">Loading checkout...</div>}>
      <CheckoutClient />
    </React.Suspense>
  );
}
