'use client';

import React, { useState, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';
import { useCartStore } from '../store/useCartStore';

export interface StorefrontDevToolsProps {
  initialOpen?: boolean;
}

export const StorefrontDevTools: React.FC<StorefrontDevToolsProps> = ({ initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [activeTab, setActiveTab] = useState<'context' | 'cms' | 'auth' | 'cart' | 'network'>('context');
  const [latencyMs, setLatencyMs] = useState<number>(50);
  const [simulatedFault, setSimulatedFault] = useState<string>('none');

  const { activeSite, activeLanguage, activeCurrency, allSites, setBaseSite, setCurrency, setLanguage } =
    useSiteContext();
  const { cart, totalItems, resetCart, applyCoupon, removeCoupon, isMiniCartOpen } = useCartStore();

  // Auth local storage snapshot
  const [authSnapshot, setAuthSnapshot] = useState<{
    isAuthenticated: boolean;
    userEmail: string;
    tokenType: string;
  }>({
    isAuthenticated: false,
    userEmail: 'guest',
    tokenType: 'GUEST',
  });

  const refreshAuthSnapshot = () => {
    if (typeof window === 'undefined') return;
    try {
      const tokenRaw = localStorage.getItem('storefront_customer_token');
      const userRaw = localStorage.getItem('storefront_user');
      if (tokenRaw && userRaw) {
        const u = JSON.parse(userRaw);
        setAuthSnapshot({
          isAuthenticated: true,
          userEmail: u.uid || u.email || 'customer',
          tokenType: 'CUSTOMER (Bearer)',
        });
      } else {
        setAuthSnapshot({
          isAuthenticated: false,
          userEmail: 'guest@anonymous.com',
          tokenType: 'GUEST (Client Credentials)',
        });
      }
    } catch {
      // Ignore parsing errors
    }
  };

  useEffect(() => {
    refreshAuthSnapshot();
  }, [isOpen]);

  const handleImpersonate = async (email: string, name: string) => {
    if (typeof window === 'undefined') return;
    const fakeToken = {
      access_token: `mock_tok_${Date.now()}`,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'openid',
    };
    const fakeUser = {
      uid: email,
      name,
      displayUid: email,
      currency: activeCurrency.isocode,
      language: activeLanguage.isocode,
    };
    localStorage.setItem('storefront_customer_token', JSON.stringify(fakeToken));
    localStorage.setItem('storefront_user', JSON.stringify(fakeUser));
    localStorage.setItem('storefront_auth_user', JSON.stringify(fakeUser));
    await useCartStore.getState().mergeGuestCartOnLogin(activeSite.uid);
    refreshAuthSnapshot();
    window.location.reload();
  };

  const handleClearAuth = async () => {
    if (typeof window === 'undefined') return;
    await useCartStore.getState().clearCart();
    localStorage.removeItem('storefront_customer_token');
    localStorage.removeItem('storefront_user');
    localStorage.removeItem('storefront_auth_user');
    refreshAuthSnapshot();
    window.location.reload();
  };

  const handleSeedCart = async (type: 'empty' | 'single' | 'heavy') => {
    if (type === 'empty') {
      const adapter = (await import('@storefront/api')).getAdapterFactory().getCartAdapter() as any;
      const c = await adapter.getCart(`CART-DEMO-${activeSite.uid}`);
      if (c) {
        c.entries = [];
        c.totalItems = 0;
        c.appliedVouchers = [];
        if (c.subTotal) {
          c.subTotal.value = 0;
          c.subTotal.formattedValue = '$0.00';
        }
        if (c.totalPrice) {
          c.totalPrice.value = 0;
          c.totalPrice.formattedValue = '$0.00';
        }
        if (typeof adapter.persist === 'function') {
          adapter.persist();
        }
      }
      useCartStore.setState({ cart: c, totalItems: 0 });
    } else if (type === 'single') {
      const defaultProd =
        activeSite.uid === 'apparel-uk'
          ? 'APP-001'
          : activeSite.uid === 'powertools-spa'
          ? 'TOOL-001'
          : 'CONF-DEMO-001';
      await resetCart(activeSite.uid, defaultProd);
    } else if (type === 'heavy') {
      const { addToCart } = useCartStore.getState();
      if (activeSite.uid === 'apparel-uk') {
        await addToCart('APP-001', 2, activeSite.uid);
        await addToCart('APP-002', 1, activeSite.uid);
        await addToCart('APP-003', 3, activeSite.uid);
      } else if (activeSite.uid === 'powertools-spa') {
        await addToCart('TOOL-001', 1, activeSite.uid);
        await addToCart('TOOL-002', 2, activeSite.uid);
        await addToCart('TOOL-004', 1, activeSite.uid);
      } else {
        await addToCart('CONF-DEMO-001', 2, activeSite.uid);
        await addToCart('CONF-DEMO-002', 1, activeSite.uid);
        await addToCart('CONF-DEMO-003', 4, activeSite.uid);
      }
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div
        className={`fixed bottom-5 right-5 z-[60] transition-all duration-200 ${
          isMiniCartOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold shadow-2xl hover:bg-blue-600 transition-all border border-slate-700 hover:scale-105 active:scale-95 cursor-pointer"
          title="Storefront Developer Tools"
        >
          <span className="text-sm">🛠️</span>
          <span>DevTools</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>

      {/* DevTools Drawer Modal */}
      {isOpen && !isMiniCartOpen && (
        <div className="fixed bottom-16 right-5 z-[60] w-96 max-w-[calc(100vw-2.5rem)] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base">🛠️</span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">Storefront DevTools</h3>
                <p className="text-[10px] text-slate-400">Spartacus React / Next.js Runtime</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('context')}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === 'context'
                  ? 'border-blue-600 text-blue-600 bg-white font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Context
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cms')}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === 'cms'
                  ? 'border-blue-600 text-blue-600 bg-white font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              CMS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('auth')}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === 'auth'
                  ? 'border-blue-600 text-blue-600 bg-white font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Auth
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cart')}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === 'cart'
                  ? 'border-blue-600 text-blue-600 bg-white font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Cart ({totalItems})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('network')}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === 'network'
                  ? 'border-blue-600 text-blue-600 bg-white font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Network
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
            {/* TAB: CONTEXT */}
            {activeTab === 'context' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Active Base Site:</span>
                    <span className="font-bold text-slate-900 font-mono">{activeSite.uid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Channel:</span>
                    <span className="font-semibold text-blue-600">{activeSite.channel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Language:</span>
                    <span className="font-bold text-slate-800">{activeLanguage.name} ({activeLanguage.isocode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Currency:</span>
                    <span className="font-bold text-slate-800">{activeCurrency.isocode} ({activeCurrency.symbol})</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Quick Store Switcher:
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {allSites.map((s) => (
                      <button
                        key={s.uid}
                        type="button"
                        onClick={() => setBaseSite(s.uid)}
                        className={`px-3 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between border transition-all ${
                          s.uid === activeSite.uid
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{s.name}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {s.channel}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CMS */}
            {activeTab === 'cms' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">CMS Provider:</span>
                    <span className="font-bold text-blue-600">Hybris OCC CMS Engine</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Component Registry:</span>
                    <span className="font-semibold text-emerald-600">9 Active Components</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">SmartEdit Bridge:</span>
                    <span className="font-semibold text-emerald-600">Ready (Contract Attributes Enabled)</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Registered Outlets:
                  </h4>
                  <ul className="space-y-1 font-mono text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <li className="flex items-center space-x-1.5">
                      <span className="text-blue-500 font-bold">●</span>
                      <span>ProductDetails.Summary</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <span className="text-blue-500 font-bold">●</span>
                      <span>ProductDetails.Actions</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <span className="text-blue-500 font-bold">●</span>
                      <span>Cart.OrderSummary</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <span className="text-blue-500 font-bold">●</span>
                      <span>Checkout.Review</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB: AUTH */}
            {activeTab === 'auth' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className={`font-bold ${authSnapshot.isAuthenticated ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {authSnapshot.isAuthenticated ? 'Authenticated' : 'Anonymous Guest'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Active User:</span>
                    <span className="font-mono text-slate-900 truncate max-w-[180px]">{authSnapshot.userEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Token Type:</span>
                    <span className="text-slate-700 font-mono text-[10px]">{authSnapshot.tokenType}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1-Click Persona Impersonator:
                  </h4>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => handleImpersonate('alex.morgan@example.com', 'Alex Morgan')}
                      className="w-full text-left p-2 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-400 transition-colors"
                    >
                      <p className="font-bold text-slate-800">Alex Morgan (B2C VIP)</p>
                      <p className="text-[10px] text-slate-500">alex.morgan@example.com • Electronics / Fashion buyer</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImpersonate('contractor@buildpro.de', 'Klaus Weber')}
                      className="w-full text-left p-2 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-400 transition-colors"
                    >
                      <p className="font-bold text-slate-800">Klaus Weber (B2B Contractor)</p>
                      <p className="text-[10px] text-slate-500">contractor@buildpro.de • Powertools wholesale buyer</p>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAuth}
                      className="w-full text-center py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-semibold"
                    >
                      Reset to Anonymous Guest
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CART */}
            {activeTab === 'cart' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Cart Code:</span>
                    <span className="font-mono text-slate-900 font-bold">{cart?.code || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Items Count:</span>
                    <span className="font-bold text-blue-600">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Total Amount:</span>
                    <span className="font-bold text-slate-900">{cart?.totalPrice?.formattedValue || '$0.00'}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Cart Seeder Presets:
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSeedCart('empty')}
                      className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-center text-slate-700"
                    >
                      Empty
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSeedCart('single')}
                      className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-center text-slate-700"
                    >
                      1 Item
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSeedCart('heavy')}
                      className="py-1.5 px-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-center"
                    >
                      Heavy Bag
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Vouchers:
                  </h4>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => applyCoupon('SAVE20', activeSite.uid)}
                      className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 font-mono text-[11px] font-bold text-slate-800"
                    >
                      + SAVE20
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCoupon('FREESHIP', activeSite.uid)}
                      className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 font-mono text-[11px] font-bold text-slate-800"
                    >
                      + FREESHIP
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NETWORK */}
            {activeTab === 'network' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Mock Adapter Delay:</span>
                    <span className="font-bold text-slate-900 font-mono">{latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Fault Simulation:</span>
                    <span className={`font-bold font-mono ${simulatedFault === 'none' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {simulatedFault.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Simulate Network Latency:
                  </h4>
                  <div className="grid grid-cols-4 gap-1 text-[11px]">
                    {[0, 80, 500, 1500].map((ms) => (
                      <button
                        key={ms}
                        type="button"
                        onClick={() => setLatencyMs(ms)}
                        className={`py-1 rounded font-semibold border ${
                          latencyMs === ms
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {ms === 0 ? '0ms' : `${ms}ms`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Simulate Server Fault:
                  </h4>
                  <div className="grid grid-cols-3 gap-1 text-[11px]">
                    {['none', '500', '401'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setSimulatedFault(f)}
                        className={`py-1 rounded font-semibold border ${
                          simulatedFault === f
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {f === 'none' ? 'Normal' : `HTTP ${f}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
