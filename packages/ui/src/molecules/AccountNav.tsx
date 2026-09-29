'use client';

import React from 'react';

export interface AccountNavItem {
  id: string;
  label: string;
  href: string;
  icon: (props: { className?: string }) => React.ReactNode;
  badge?: string | number;
}

export interface AccountNavProps {
  currentPath?: string;
  activeId?: string;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
}

const NAV_ITEMS: AccountNavItem[] = [
  {
    id: 'dashboard',
    label: 'Account Dashboard',
    href: '/my-account',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'Order History',
    href: '/my-account/orders',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 'addresses',
    label: 'Address Book',
    href: '/my-account/address-book',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'payments',
    label: 'Payment Details',
    href: '/my-account/payment-methods',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Personal Details',
    href: '/my-account/profile',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export const AccountNav: React.FC<AccountNavProps> = ({
  currentPath = '',
  activeId,
  onNavigate,
  onLogout,
}) => {
  const isItemActive = (item: AccountNavItem) => {
    if (activeId) return activeId === item.id;
    if (!currentPath) return false;
    if (item.href === '/my-account') {
      return currentPath === '/my-account' || currentPath === '/my-account/';
    }
    return currentPath.startsWith(item.href);
  };

  return (
    <nav className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-1">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Account Menu
      </div>

      {NAV_ITEMS.map((item) => {
        const active = isItemActive(item);
        return (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(item.href);
              }
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={active ? 'text-white' : 'text-slate-400'}>
                {item.icon({ className: 'w-5 h-5' })}
              </span>
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  active ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {item.badge}
              </span>
            )}
          </a>
        );
      })}

      {onLogout && (
        <div className="pt-3 mt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};
