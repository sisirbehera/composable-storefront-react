'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@storefront/auth';
import { getAdapterFactory } from '@storefront/api';
import { appConfig } from '@/config/storefront.config';
import { Address, OrderHistoryItem, PaymentDetails } from '@storefront/core';

export default function MyAccountDashboardPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const [recentOrders, setRecentOrders] = useState<OrderHistoryItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!authState.user?.uid) return;
      setLoading(true);
      try {
        const factory = getAdapterFactory(appConfig);
        const userAdapter = factory.getUserAdapter();

        const [historyRes, addrRes, payRes] = await Promise.all([
          userAdapter.getOrderHistory(authState.user.uid, 2, 0),
          userAdapter.getAddresses(authState.user.uid),
          userAdapter.getPaymentDetails(authState.user.uid),
        ]);

        setRecentOrders(historyRes.orders);
        setAddresses(addrRes);
        setPayments(payRes);
      } catch (err) {
        console.error('Failed to load account dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [authState.user?.uid]);

  const defaultAddress = addresses.find((a) => a.defaultAddress) || addresses[0];
  const defaultPayment = payments.find((p) => p.defaultPayment) || payments[0];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-black mb-2">
          Welcome back, {authState.user?.firstName || authState.user?.name || 'Customer'}!
        </h2>
        <p className="text-blue-100 text-sm max-w-xl mb-6">
          From your customer dashboard, you can view your recent orders, manage your shipping addresses, review saved payment methods, and update your personal details.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push('/my-account/orders')}
            className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            View Order History &rarr;
          </button>
          <button
            type="button"
            onClick={() => router.push('/my-account/profile')}
            className="px-5 py-2.5 bg-blue-500/30 hover:bg-blue-500/40 text-white text-xs font-bold rounded-xl backdrop-blur-sm transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => router.push('/my-account/orders')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : recentOrders.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Total recorded purchases</p>
        </div>

        <div
          onClick={() => router.push('/my-account/address-book')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Addresses</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : addresses.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Saved shipping destinations</p>
        </div>

        <div
          onClick={() => router.push('/my-account/payment-methods')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Cards</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : payments.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Saved credit & debit cards</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
            <p className="text-xs text-slate-500">Your latest storefront transactions</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/my-account/orders')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            View All ({recentOrders.length}) &rarr;
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-14 bg-slate-100 rounded-xl"></div>
            <div className="h-14 bg-slate-100 rounded-xl"></div>
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No recent orders found.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.code}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{order.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {order.statusDisplay || order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Placed on {order.placed ? new Date(order.placed).toLocaleDateString() : 'Recent'} &bull; {order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <span className="font-bold text-sm text-slate-900">
                    {order.total.formattedValue || `${order.total.currencyIso} ${order.total.value.toFixed(2)}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => router.push(`/my-account/orders/${order.code}`)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Snapshots: Default Address & Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Address */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Primary Delivery Address</h3>
              <button
                type="button"
                onClick={() => router.push('/my-account/address-book')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Manage
              </button>
            </div>
            {defaultAddress ? (
              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-900">
                  {defaultAddress.firstName} {defaultAddress.lastName}
                </p>
                <p>{defaultAddress.line1}</p>
                {defaultAddress.line2 && <p>{defaultAddress.line2}</p>}
                <p>
                  {defaultAddress.city}, {defaultAddress.postalCode}
                </p>
                <p>{defaultAddress.country}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3">No default address set.</p>
            )}
          </div>
        </div>

        {/* Default Payment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Primary Payment Method</h3>
              <button
                type="button"
                onClick={() => router.push('/my-account/payment-methods')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Manage
              </button>
            </div>
            {defaultPayment ? (
              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{defaultPayment.cardType}</span>
                  <span className="font-mono text-slate-700">
                    •••• {defaultPayment.cardNumber.slice(-4)}
                  </span>
                </div>
                <p className="text-slate-500">Cardholder: {defaultPayment.accountHolderName}</p>
                <p className="text-slate-500">
                  Expires: {defaultPayment.expiryMonth}/{defaultPayment.expiryYear}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3">No saved payment methods.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
