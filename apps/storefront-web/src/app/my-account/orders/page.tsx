'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@storefront/auth';
import { getAdapterFactory } from '@storefront/api';
import { appConfig } from '@/config/storefront.config';
import { OrderHistoryItem } from '@storefront/core';
import { OrderHistoryTable } from '@storefront/ui';

export default function MyOrdersPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async (page: number) => {
    if (!authState.user?.uid) return;
    setLoading(true);
    try {
      const factory = getAdapterFactory(appConfig);
      const userAdapter = factory.getUserAdapter();
      const res = await userAdapter.getOrderHistory(authState.user.uid, 5, page);
      setOrders(res.orders);
      setCurrentPage(res.pagination.currentPage);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error('Failed to fetch order history:', err);
    } finally {
      setLoading(false);
    }
  }, [authState.user?.uid]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  return (
    <div className="space-y-6">
      <OrderHistoryTable
        orders={orders}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        onViewOrder={(code) => router.push(`/my-account/orders/${code}`)}
        onShopNow={() => router.push('/search')}
      />
    </div>
  );
}
