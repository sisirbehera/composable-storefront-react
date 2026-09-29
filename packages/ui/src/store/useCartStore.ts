'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cart } from '@storefront/core';
import { getAdapterFactory } from '@storefront/api';

export interface CartStoreState {
  cart: Cart | null;
  totalItems: number;
  isMiniCartOpen: boolean;
  isLoading: boolean;
  error: string | null;
  activeSiteId: string;

  // Actions
  loadCart: (siteId?: string) => Promise<void>;
  addToCart: (
    productCode: string,
    quantity?: number,
    siteId?: string,
    openDrawer?: boolean
  ) => Promise<void>;
  updateEntry: (entryNumber: number, quantity: number, siteId?: string) => Promise<void>;
  removeEntry: (entryNumber: number, siteId?: string) => Promise<void>;
  applyCoupon: (code: string, siteId?: string) => Promise<void>;
  removeCoupon: (code: string, siteId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeGuestCartOnLogin: (siteId?: string) => Promise<void>;
  resetCart: (siteId?: string, defaultProductCode?: string) => Promise<void>;
  openMiniCart: () => void;
  closeMiniCart: () => void;
  toggleMiniCart: () => void;
}

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) return (globalThis as any).localStorage;
  return null;
}

export function isUserAuthenticated(): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    const token = storage.getItem('storefront_customer_token');
    const user =
      storage.getItem('storefront_auth_user') ||
      storage.getItem('storefront_user');
    return Boolean(token && user);
  } catch {
    return false;
  }
}

export function resolveCartId(siteId?: string, forceGuest?: boolean): string {
  let site = siteId;
  const storage = getStorage();
  if (!site && storage) {
    try {
      site = storage.getItem('storefront_base_site') || undefined;
    } catch {
      // Ignore localStorage errors
    }
  }
  const effectiveSite = site || 'electronics-spa';
  const authenticated = !forceGuest && isUserAuthenticated();
  return authenticated ? `CART-DEMO-${effectiveSite}` : `CART-GUEST-${effectiveSite}`;
}

function computeTotalItems(cart: Cart | null | undefined): number {
  if (!cart) return 0;
  if (typeof cart.totalItems === 'number') return cart.totalItems;
  return cart.entries?.reduce((sum: number, e) => sum + (e.quantity || 0), 0) ?? 0;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      cart: null,
      totalItems: 0,
      isMiniCartOpen: false,
      isLoading: false,
      error: null,
      activeSiteId: 'electronics-spa',

      loadCart: async (siteId?: string) => {
        const targetSiteId = siteId || get().activeSiteId || 'electronics-spa';
        const cartId = resolveCartId(targetSiteId);
        set({ isLoading: true, error: null, activeSiteId: targetSiteId });
        try {
          const adapter = getAdapterFactory().getCartAdapter();
          let currentCart = await adapter.getCart(cartId);

          // If adapter returned null or empty, but state has persisted cart for this siteId, retain it
          if (!currentCart && get().cart && (get().cart?.code === cartId || !siteId)) {
            currentCart = get().cart;
          }

          set({
            cart: currentCart,
            totalItems: computeTotalItems(currentCart),
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message || 'Failed to load cart', isLoading: false });
        }
      },

      addToCart: async (
        productCode: string,
        quantity: number = 1,
        siteId?: string,
        openDrawer: boolean = false
      ) => {
        const targetSiteId = siteId || get().activeSiteId || 'electronics-spa';
        const cartId = resolveCartId(targetSiteId);
        set({ isLoading: true, error: null, activeSiteId: targetSiteId });
        try {
          const adapter = getAdapterFactory().getCartAdapter();
          const updated = await adapter.addToCart(cartId, productCode, quantity);
          set({
            cart: updated,
            totalItems: computeTotalItems(updated),
            isLoading: false,
            isMiniCartOpen: openDrawer ? true : get().isMiniCartOpen,
          });
        } catch (err: any) {
          set({ error: err.message || 'Failed to add item to cart', isLoading: false });
          throw err;
        }
      },

      updateEntry: async (entryNumber: number, quantity: number, siteId?: string) => {
        const targetSiteId = siteId || get().activeSiteId || 'electronics-spa';
        const cartId = resolveCartId(targetSiteId);
        set({ isLoading: true, error: null });
        try {
          const adapter = getAdapterFactory().getCartAdapter();
          const updated = await adapter.updateCartEntry(cartId, entryNumber, quantity);
          set({
            cart: updated,
            totalItems: computeTotalItems(updated),
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message || 'Failed to update item', isLoading: false });
          throw err;
        }
      },

      removeEntry: async (entryNumber: number, siteId?: string) => {
        const targetSiteId = siteId || get().activeSiteId || 'electronics-spa';
        const cartId = resolveCartId(targetSiteId);
        set({ isLoading: true, error: null });
        try {
          const adapter = getAdapterFactory().getCartAdapter();
          const updated = await adapter.removeCartEntry(cartId, entryNumber);
          set({
            cart: updated,
            totalItems: computeTotalItems(updated),
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message || 'Failed to remove item', isLoading: false });
          throw err;
        }
      },

      applyCoupon: async (code: string, siteId?: string) => {
        const targetSiteId = siteId || get().activeSiteId || 'electronics-spa';
        const cartId = resolveCartId(targetSiteId);
        set({ isLoading: true, error: null });
        try {
          const adapter = getAdapterFactory().getCartAdapter();
          const updated = await adapter.applyCoupon(cartId, code);
          set({
            cart: updated,
            totalItems: computeTotalItems(updated),
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message || 'Failed to apply coupon', isLoading: false });
          throw err;
        }
      },

      removeCoupon: async (code: string, siteId?: string) => {
        const targetSiteId = siteId || get().activeSiteId || 'electronics-spa';
        const cartId = resolveCartId(targetSiteId);
        set({ isLoading: true, error: null });
        try {
          const adapter = getAdapterFactory().getCartAdapter();
          const updated = await adapter.removeCoupon(cartId, code);
          set({
            cart: updated,
            totalItems: computeTotalItems(updated),
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message || 'Failed to remove coupon', isLoading: false });
          throw err;
        }
      },

      clearCart: async () => {
        const targetSiteId = get().activeSiteId || 'electronics-spa';
        const currentCode = get().cart?.code || resolveCartId(targetSiteId);
        const currencyIso = targetSiteId === 'apparel-uk' ? 'GBP' : 'USD';
        const emptyCart: Cart = {
          code: currentCode,
          guid: currentCode,
          totalItems: 0,
          entries: [],
          appliedVouchers: [],
          totalPrice: {
            currencyIso,
            value: 0,
            formattedValue: targetSiteId === 'apparel-uk' ? '£0.00' : '$0.00',
          },
          subTotal: {
            currencyIso,
            value: 0,
            formattedValue: targetSiteId === 'apparel-uk' ? '£0.00' : '$0.00',
          },
          deliveryCost: {
            currencyIso,
            value: 0,
            formattedValue: 'Free',
          },
          totalDiscounts: {
            currencyIso,
            value: 0,
            formattedValue: targetSiteId === 'apparel-uk' ? '£0.00' : '$0.00',
          },
        };

        set({
          cart: emptyCart,
          totalItems: 0,
          isMiniCartOpen: false,
          isLoading: false,
          error: null,
        });

        if (typeof window !== 'undefined') {
          try {
            const adapter = getAdapterFactory().getCartAdapter() as any;
            if (typeof adapter.clearCart === 'function') {
              await adapter.clearCart(currentCode);
              if (currentCode.startsWith('CART-DEMO-')) {
                await adapter.clearCart(`CART-GUEST-${targetSiteId}`);
              }
            }
          } catch {
            // Ignore adapter errors on clear
          }
        }
      },

      mergeGuestCartOnLogin: async (siteId?: string) => {
        const targetSiteId = siteId || get().activeSiteId || 'electronics-spa';
        const guestCartId = `CART-GUEST-${targetSiteId}`;
        const customerCartId = `CART-DEMO-${targetSiteId}`;

        set({ isLoading: true, error: null, activeSiteId: targetSiteId });
        try {
          const adapter = getAdapterFactory().getCartAdapter() as any;
          let customerCart: Cart | null = null;

          const currentCart = get().cart;
          const hasGuestItems =
            Boolean(currentCart && currentCart.code.includes('GUEST') && currentCart.totalItems > 0);

          if (hasGuestItems && typeof adapter.mergeCarts === 'function') {
            customerCart = await adapter.mergeCarts(guestCartId, customerCartId);
          } else {
            customerCart = await adapter.getCart(customerCartId);
          }

          set({
            cart: customerCart,
            totalItems: computeTotalItems(customerCart),
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message || 'Failed to sync cart on login', isLoading: false });
        }
      },

      resetCart: async (siteId?: string, defaultProductCode?: string) => {
        const targetSiteId = siteId || get().activeSiteId || 'electronics-spa';
        const cartId = resolveCartId(targetSiteId);
        set({ isLoading: true, error: null });
        try {
          const adapter = getAdapterFactory().getCartAdapter() as any;
          if (typeof adapter.resetDemoCarts === 'function') {
            adapter.resetDemoCarts();
          }
          const updated = await adapter.getCart(cartId);
          set({
            cart: updated,
            totalItems: computeTotalItems(updated),
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message || 'Failed to reset demo cart', isLoading: false });
        }
      },

      openMiniCart: () => set({ isMiniCartOpen: true }),
      closeMiniCart: () => set({ isMiniCartOpen: false }),
      toggleMiniCart: () => set((state) => ({ isMiniCartOpen: !state.isMiniCartOpen })),
    }),
    {
      name: 'storefront_cart_state',
      storage: createJSONStorage(() => {
        const s = getStorage();
        return s || {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        cart: state.cart,
        totalItems: state.totalItems,
        activeSiteId: state.activeSiteId,
      }),
    }
  )
);

// Decoupled listener for authentication changes
if (typeof window !== 'undefined') {
  window.addEventListener('storefront:auth:logout', () => {
    useCartStore.getState().clearCart();
  });
  window.addEventListener('storefront:auth:login', () => {
    useCartStore.getState().mergeGuestCartOnLogin();
  });
}

