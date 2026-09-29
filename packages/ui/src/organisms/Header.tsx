'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User } from '@storefront/core';
import { SearchBox } from '../molecules/SearchBox';
import { SiteContextSwitcher } from '../molecules/SiteContextSwitcher';
import { ThemeToggle } from '../atoms/ThemeToggle';
import { useSiteContext } from '../context/SiteContext';
import { useCartStore } from '../store/useCartStore';
import { MiniCartDrawer } from './MiniCartDrawer';

export interface HeaderProps {
  cartItemCount?: number;
  useMockData?: boolean;
  user?: User | null;
  isAuthenticated?: boolean;
  onNavigateHome?: () => void;
  onNavigateBrowseAll?: () => void;
  onNavigateCart?: () => void;
  onNavigateLogin?: () => void;
  onNavigateAccount?: () => void;
  onNavigateOrders?: () => void;
  onNavigateAddresses?: () => void;
  onNavigatePaymentMethods?: () => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  onFetchSuggestions?: (term: string) => Promise<string[]>;
}

const SITE_CATEGORIES: Record<string, { code: string; name: string; icon: string }[]> = {
  'electronics-spa': [
    { code: 'audio', name: 'Audio & Sound', icon: '🎧' },
    { code: 'headphones', name: 'Headphones', icon: '🎵' },
    { code: 'laptops', name: 'Computers & Laptops', icon: '💻' },
    { code: 'wearables', name: 'Smart Wearables', icon: '⌚' },
  ],
  'apparel-uk': [
    { code: 'trench-coats', name: 'Trench Coats & Outerwear', icon: '🧥' },
    { code: 'footwear', name: 'Handcrafted Footwear', icon: '👞' },
    { code: 'knitwear', name: 'Cashmere & Knitwear', icon: '🧣' },
    { code: 'tailoring', name: 'British Tailoring', icon: '👔' },
  ],
  'powertools-spa': [
    { code: 'powertools', name: 'Power Tools', icon: '🛠️' },
    { code: 'drills', name: 'Cordless Drills', icon: '🔩' },
    { code: 'saws', name: 'Brushless Saws', icon: '🪚' },
    { code: 'toolkits', name: 'Contractor Toolkits', icon: '🧰' },
  ],
};

export const Header: React.FC<HeaderProps> = ({
  cartItemCount = 0,
  useMockData = true,
  user,
  isAuthenticated = false,
  onNavigateHome,
  onNavigateBrowseAll,
  onNavigateCart,
  onNavigateLogin,
  onNavigateAccount,
  onNavigateOrders,
  onNavigateAddresses,
  onNavigatePaymentMethods,
  onLogout,
  onSearch,
  onFetchSuggestions,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const { totalItems: storeTotalItems, toggleMiniCart } = useCartStore();
  const effectiveCartCount =
    cartItemCount !== undefined && cartItemCount > 0 ? cartItemCount : storeTotalItems;

  let t = (key: string) => {
    switch (key) {
      case 'common.home': return 'Home';
      case 'common.browseAll': return 'Browse All';
      case 'common.signIn': return 'Sign In';
      case 'common.signOut': return 'Sign Out';
      case 'common.myAccount': return 'My Account';
      case 'common.cart': return 'Cart';
      default: return key;
    }
  };

  let siteContext: any = null;
  try {
    siteContext = useSiteContext();
    if (siteContext?.t) t = siteContext.t;
  } catch {
    // Outside SiteContextProvider fallback
  }

  const currentSiteId = siteContext?.activeSite?.uid || 'electronics-spa';
  const categoriesForSite = SITE_CATEGORIES[currentSiteId] || SITE_CATEGORIES['electronics-spa'];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md transition-colors duration-200">
      {/* Top Notification & Site Context Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 font-medium flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Composable Storefront (React Commerce)</span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-300 hidden md:inline">
            Source: {useMockData ? 'Mock Data Module (Fixtures)' : 'Live SAP Commerce (OCC API)'}
          </span>
        </div>

        {/* Site Context Switcher (Store / Language / Currency) + Theme Toggle */}
        <div className="flex items-center space-x-3">
          <SiteContextSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <div
          onClick={onNavigateHome}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:bg-blue-700 transition-colors">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Composable
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold -mt-1">
              Storefront
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <SearchBox
            onSearch={(query) => {
              if (onSearch) {
                onSearch(query);
              } else if (typeof window !== 'undefined') {
                window.location.href = `/search?query=${encodeURIComponent(query)}`;
              }
            }}
            onFetchSuggestions={onFetchSuggestions}
          />
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-4">
          <a
            href="/"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:inline-block cursor-pointer"
          >
            {t('common.home')}
          </a>

          {/* Categories Dropdown */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:flex items-center space-x-1 cursor-pointer"
              aria-expanded={categoryDropdownOpen}
            >
              <span>Categories</span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {categoryDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  Featured Categories
                </div>
                {categoriesForSite.map((cat) => (
                  <a
                    key={cat.code}
                    href={`/category/${cat.code}?site=${currentSiteId}`}
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span className="mr-3 text-base">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="/search"
            onClick={(e) => {
              if (onNavigateBrowseAll) {
                e.preventDefault();
                onNavigateBrowseAll();
              }
            }}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:inline-block cursor-pointer"
          >
            {t('common.browseAll')}
          </a>

          {/* User Account / Auth Section */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-200"
                aria-expanded={dropdownOpen}
                aria-label="User Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
                  {initials}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    {user?.firstName || user?.name || 'My Account'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Account & Orders</span>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.displayUid || user?.uid || user?.name}</p>
                  </div>

                  <div className="py-1">
                    <a
                      href="/my-account"
                      onClick={(e) => {
                        if (onNavigateAccount) {
                          e.preventDefault();
                          setDropdownOpen(false);
                          onNavigateAccount();
                        }
                      }}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Account Dashboard
                    </a>

                    <a
                      href="/my-account/orders"
                      onClick={(e) => {
                        if (onNavigateOrders) {
                          e.preventDefault();
                          setDropdownOpen(false);
                          onNavigateOrders();
                        }
                      }}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Order History
                    </a>

                    <a
                      href="/my-account/address-book"
                      onClick={(e) => {
                        if (onNavigateAddresses) {
                          e.preventDefault();
                          setDropdownOpen(false);
                          onNavigateAddresses();
                        }
                      }}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Saved Addresses
                    </a>

                    <a
                      href="/my-account/payment-methods"
                      onClick={(e) => {
                        if (onNavigatePaymentMethods) {
                          e.preventDefault();
                          setDropdownOpen(false);
                          onNavigatePaymentMethods();
                        }
                      }}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Payment Methods
                    </a>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left font-medium cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              onClick={(e) => {
                if (onNavigateLogin) {
                  e.preventDefault();
                  onNavigateLogin();
                }
              }}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Sign In</span>
            </a>
          )}

          {/* Cart Icon */}
          <button
            type="button"
            onClick={() => toggleMiniCart()}
            className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Shopping Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {effectiveCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-scale-in">
                {effectiveCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Reactive Slide-over Mini-Cart Drawer */}
      <MiniCartDrawer onNavigateCart={onNavigateCart} />
    </header>
  );
};
