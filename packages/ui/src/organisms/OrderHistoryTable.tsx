'use client';

import React from 'react';
import { OrderHistoryItem } from '@storefront/core';

export interface OrderHistoryTableProps {
  orders: OrderHistoryItem[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onViewOrder?: (orderCode: string) => void;
  onShopNow?: () => void;
}

export const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({
  orders,
  isLoading = false,
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  onViewOrder,
  onShopNow,
}) => {
  const getStatusBadge = (status: string, display?: string) => {
    const s = status.toUpperCase();
    let bg = 'bg-slate-100 text-slate-700 border-slate-200';

    if (s === 'COMPLETED' || s === 'DELIVERED') {
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (s === 'PROCESSING' || s === 'SHIPPED') {
      bg = 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (s === 'CONFIRMED' || s === 'CREATED') {
      bg = 'bg-amber-50 text-amber-700 border-amber-200';
    } else if (s === 'CANCELLED') {
      bg = 'bg-rose-50 text-rose-700 border-rose-200';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg}`}>
        {display || status}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-100 rounded"></div>
          <div className="h-10 bg-slate-100 rounded"></div>
          <div className="h-10 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No Orders Placed Yet</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
          When you place orders, they will appear here with full delivery tracking, invoices, and item receipts.
        </p>
        <button
          type="button"
          onClick={onShopNow}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Order History</h2>
          <p className="text-xs text-slate-500">View and track all your previous orders</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="px-6 py-3.5">Order Number</th>
              <th className="px-6 py-3.5">Date Placed</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Items</th>
              <th className="px-6 py-3.5">Total</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {orders.map((order) => (
              <tr key={order.code} className="hover:bg-slate-50/75 transition-colors">
                <td className="px-6 py-4 font-mono font-semibold text-blue-600">
                  <button
                    type="button"
                    onClick={() => onViewOrder?.(order.code)}
                    className="hover:underline focus:outline-none"
                  >
                    {order.code}
                  </button>
                </td>
                <td className="px-6 py-4 text-slate-600">{formatDate(order.placed)}</td>
                <td className="px-6 py-4">
                  {getStatusBadge(order.status, order.statusDisplay)}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {order.total.formattedValue || `${order.total.currencyIso} ${order.total.value.toFixed(2)}`}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onViewOrder?.(order.code)}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>View Receipt</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-sm">
          <div className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-700">{currentPage + 1}</span> of{' '}
            <span className="font-semibold text-slate-700">{totalPages}</span>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages - 1}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
