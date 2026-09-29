'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@storefront/auth';
import { getAdapterFactory } from '@storefront/api';
import { appConfig } from '@/config/storefront.config';
import { PaymentDetails } from '@storefront/core';
import { PaymentMethodsGrid } from '@storefront/ui';

export default function PaymentMethodsPage() {
  const { authState } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = useCallback(async () => {
    if (!authState.user?.uid) return;
    setLoading(true);
    try {
      const factory = getAdapterFactory(appConfig);
      const userAdapter = factory.getUserAdapter();
      const list = await userAdapter.getPaymentDetails(authState.user.uid);
      setPaymentMethods(list);
    } catch (err) {
      console.error('Failed to load payment methods:', err);
    } finally {
      setLoading(false);
    }
  }, [authState.user?.uid]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleAddPayment = async (payment: PaymentDetails) => {
    if (!authState.user?.uid) return;
    const factory = getAdapterFactory(appConfig);
    // If MockUserAdapter has addPaymentDetails
    const userAdapter = factory.getUserAdapter() as any;
    if (typeof userAdapter.addPaymentDetails === 'function') {
      await userAdapter.addPaymentDetails(authState.user.uid, payment);
    }
    await loadPayments();
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!authState.user?.uid) return;
    const factory = getAdapterFactory(appConfig);
    await factory.getUserAdapter().deletePaymentDetails(authState.user.uid, paymentId);
    await loadPayments();
  };

  return (
    <div className="space-y-6">
      <PaymentMethodsGrid
        paymentMethods={paymentMethods}
        isLoading={loading}
        onAddPaymentMethod={handleAddPayment}
        onDeletePaymentMethod={handleDeletePayment}
      />
    </div>
  );
}
