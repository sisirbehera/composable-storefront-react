'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import { AccountNav, useCartStore } from '@storefront/ui';
import { useAuth } from '@storefront/auth';

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, authState } = useAuth();
  const { clearCart } = useCartStore();

  return (
    <AuthGuard>
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
            <a href="/" className="hover:text-blue-600 transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/my-account" className="hover:text-blue-600 transition-colors">
              My Account
            </a>
            {pathname !== '/my-account' && (
              <>
                <span>/</span>
                <span className="text-slate-800 font-semibold capitalize">
                  {pathname.replace('/my-account/', '').replace('-', ' ')}
                </span>
              </>
            )}
          </nav>

          {/* Account Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                {authState.user?.name ? authState.user.name[0].toUpperCase() : 'A'}
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900">
                  {authState.user?.name || 'Customer Account'}
                </h1>
                <p className="text-xs text-slate-500">
                  {authState.user?.displayUid || authState.user?.uid || 'Customer Portal'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                Active Session
              </span>
            </div>
          </div>

          {/* 2-Column Account Body */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <AccountNav
                currentPath={pathname}
                onNavigate={(href) => router.push(href)}
                onLogout={async () => {
                  await clearCart();
                  logout();
                  router.push('/login');
                }}
              />
            </aside>

            {/* Main Area */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
