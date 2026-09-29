import React from 'react';
import { getAdapterFactory } from '@storefront/api';
import { appConfig } from '@/config/storefront.config';
import { OrderConfirmationClient } from './OrderConfirmationClient';

interface OrderConfirmationPageProps {
  params: Promise<{
    orderCode: string;
  }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderCode } = await params;
  const factory = getAdapterFactory(appConfig);
  const checkoutAdapter = factory.getCheckoutAdapter();
  const order = await checkoutAdapter.getOrder(orderCode);

  return (
    <React.Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">Loading order receipt...</div>}>
      <OrderConfirmationClient
        orderCode={orderCode}
        initialOrder={order}
      />
    </React.Suspense>
  );
}
