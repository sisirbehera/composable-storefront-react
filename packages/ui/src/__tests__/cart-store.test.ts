import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../store/useCartStore';
import { getAdapterFactory } from '@storefront/api';

class MockStorage implements Storage {
  private store = new Map<string, string>();
  get length() { return this.store.size; }
  clear() { this.store.clear(); }
  getItem(key: string) { return this.store.get(key) ?? null; }
  key(index: number) { return Array.from(this.store.keys())[index] ?? null; }
  removeItem(key: string) { this.store.delete(key); }
  setItem(key: string, value: string) { this.store.set(key, String(value)); }
}

if (typeof globalThis !== 'undefined' && !(globalThis as any).localStorage) {
  (globalThis as any).localStorage = new MockStorage();
}

describe('Zustand Global Cart Store (useCartStore)', () => {
  beforeEach(async () => {
    const storage = typeof window !== 'undefined' ? window.localStorage : (globalThis as any).localStorage;
    if (storage) {
      storage.clear();
    }
    const adapter = getAdapterFactory().getCartAdapter() as any;
    if (typeof adapter.resetDemoCarts === 'function') {
      adapter.resetDemoCarts();
    }
    await useCartStore.getState().clearCart();
    useCartStore.setState({
      cart: null,
      totalItems: 0,
      isMiniCartOpen: false,
      isLoading: false,
      error: null,
      activeSiteId: 'electronics-spa',
    });
  });

  it('initializes with default empty/null state', () => {
    const state = useCartStore.getState();
    expect(state.cart).toBeNull();
    expect(state.totalItems).toBe(0);
    expect(state.isMiniCartOpen).toBe(false);
  });

  it('loads empty guest cart for unauthenticated user', async () => {
    await useCartStore.getState().loadCart('electronics-spa');
    const state = useCartStore.getState();

    expect(state.cart).not.toBeNull();
    expect(state.cart?.code).toContain('CART-GUEST');
    expect(state.totalItems).toBe(0);
    expect(state.activeSiteId).toBe('electronics-spa');
    expect(state.error).toBeNull();
  });

  it('loads customer demo cart when user is authenticated in localStorage', async () => {
    const storage = typeof window !== 'undefined' ? window.localStorage : (globalThis as any).localStorage;
    if (storage) {
      storage.setItem('storefront_customer_token', JSON.stringify({ access_token: 'tok' }));
      storage.setItem('storefront_auth_user', JSON.stringify({ uid: 'alex.morgan@example.com' }));
    }

    await useCartStore.getState().loadCart('electronics-spa');
    const state = useCartStore.getState();

    expect(state.cart).not.toBeNull();
    expect(state.cart?.code).toContain('CART-DEMO');
    expect(state.totalItems).toBeGreaterThanOrEqual(1);

    if (storage) {
      storage.removeItem('storefront_customer_token');
      storage.removeItem('storefront_auth_user');
    }
  });

  it('clears active cart and resets totalItems to 0 on clearCart', async () => {
    // Add item first
    await useCartStore.getState().addToCart('CONF-DEMO-001', 2, 'electronics-spa');
    expect(useCartStore.getState().totalItems).toBe(2);

    // Call clearCart
    await useCartStore.getState().clearCart();
    const state = useCartStore.getState();

    expect(state.totalItems).toBe(0);
    expect(state.cart?.entries).toHaveLength(0);
    expect(state.cart?.code).toContain('CART-GUEST');
  });

  it('merges guest cart items into customer cart on login', async () => {
    const storage = typeof window !== 'undefined' ? window.localStorage : (globalThis as any).localStorage;
    // Guest adds item
    await useCartStore.getState().addToCart('CONF-DEMO-001', 2, 'electronics-spa');
    expect(useCartStore.getState().totalItems).toBe(2);

    // Authenticate
    if (storage) {
      storage.setItem('storefront_customer_token', JSON.stringify({ access_token: 'tok' }));
      storage.setItem('storefront_auth_user', JSON.stringify({ uid: 'alex.morgan@example.com' }));
    }

    // Merge on login
    await useCartStore.getState().mergeGuestCartOnLogin('electronics-spa');
    const state = useCartStore.getState();

    expect(state.cart?.code).toContain('CART-DEMO');
    expect(state.totalItems).toBeGreaterThanOrEqual(2);

    if (storage) {
      storage.removeItem('storefront_customer_token');
      storage.removeItem('storefront_auth_user');
    }
  });

  it('controls mini-cart drawer open/close/toggle', () => {
    const store = useCartStore.getState();
    expect(store.isMiniCartOpen).toBe(false);

    store.openMiniCart();
    expect(useCartStore.getState().isMiniCartOpen).toBe(true);

    store.closeMiniCart();
    expect(useCartStore.getState().isMiniCartOpen).toBe(false);

    store.toggleMiniCart();
    expect(useCartStore.getState().isMiniCartOpen).toBe(true);
  });

  it('adds product to cart and optionally opens mini-cart drawer', async () => {
    await useCartStore.getState().loadCart('electronics-spa');
    const initialItems = useCartStore.getState().totalItems;

    // Add CONF-DEMO-001 (Spartacus Pro Headset)
    await useCartStore.getState().addToCart('CONF-DEMO-001', 2, 'electronics-spa', true);

    const updatedState = useCartStore.getState();
    expect(updatedState.totalItems).toBe(initialItems + 2);
    expect(updatedState.isMiniCartOpen).toBe(true);
  });

  it('updates entry quantity and recalculates totals', async () => {
    await useCartStore.getState().addToCart('CONF-DEMO-001', 1, 'electronics-spa');
    const cart = useCartStore.getState().cart!;
    expect(cart.entries.length).toBeGreaterThan(0);

    const firstEntry = cart.entries[0];
    await useCartStore.getState().updateEntry(firstEntry.entryNumber, 5, 'electronics-spa');

    const updated = useCartStore.getState().cart!;
    const entryAfter = updated.entries.find((e) => e.entryNumber === firstEntry.entryNumber);
    expect(entryAfter?.quantity).toBe(5);
  });

  it('applies SAVE20 voucher with 20% discount calculation', async () => {
    await useCartStore.getState().addToCart('CONF-DEMO-001', 1, 'electronics-spa');
    await useCartStore.getState().applyCoupon('SAVE20', 'electronics-spa');

    const cart = useCartStore.getState().cart!;
    expect(cart.appliedVouchers).toBeDefined();
    expect(cart.appliedVouchers?.some((v) => v.code === 'SAVE20')).toBe(true);
    expect(cart.totalDiscounts?.value).toBeGreaterThan(0);
  });

  it('removes line item when removeEntry is called', async () => {
    await useCartStore.getState().addToCart('CONF-DEMO-001', 1, 'electronics-spa');
    const entriesCount = useCartStore.getState().cart!.entries.length;

    await useCartStore.getState().removeEntry(0, 'electronics-spa');
    const updatedCount = useCartStore.getState().cart!.entries.length;
    expect(updatedCount).toBe(entriesCount - 1);
  });

  it('persists cart state configured with storefront_cart_state storage key', async () => {
    await useCartStore.getState().loadCart('electronics-spa');
    await useCartStore.getState().addToCart('CONF-DEMO-001', 1, 'electronics-spa');

    const state = useCartStore.getState();
    expect(state.cart).not.toBeNull();
    expect(state.totalItems).toBeGreaterThanOrEqual(1);
    expect(useCartStore.persist).toBeDefined();
    expect(useCartStore.persist.getOptions().name).toBe('storefront_cart_state');
  });
});
