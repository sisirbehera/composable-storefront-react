import { describe, it, expect, beforeEach } from 'vitest';
import { MockCartAdapter } from '../mocks/mock-cart-adapter';
import { MockCheckoutAdapter } from '../mocks/mock-checkout-adapter';

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

describe('MockCheckoutAdapter & Cart Persistence', () => {
  let cartAdapter: MockCartAdapter;
  let checkoutAdapter: MockCheckoutAdapter;

  beforeEach(() => {
    (globalThis as any).localStorage.clear();
    cartAdapter = new MockCartAdapter();
    checkoutAdapter = new MockCheckoutAdapter(cartAdapter);
  });

  it('preserves delivery address, delivery mode, and payment details across getCart calls', async () => {
    const guestCartId = 'CART-GUEST-electronics-spa';

    // 1. Add item to guest cart
    const cart = await cartAdapter.addToCart(guestCartId, 'CONF-DEMO-001', 1);
    expect(cart.entries.length).toBe(1);

    // 2. Set delivery address
    const addresses = await checkoutAdapter.getDeliveryAddresses();
    const updatedAddressCart = await checkoutAdapter.setDeliveryAddress(guestCartId, addresses[0]);
    expect(updatedAddressCart.deliveryAddress?.city).toBe(addresses[0].city);

    // 3. Verify getCart preserves delivery address from storage
    const cartAfterAddress = await cartAdapter.getCart(guestCartId);
    expect(cartAfterAddress?.deliveryAddress?.city).toBe(addresses[0].city);

    // 4. Set delivery mode
    const modes = await checkoutAdapter.getSupportedDeliveryModes(guestCartId);
    const updatedModeCart = await checkoutAdapter.setDeliveryMode(guestCartId, modes[1].code);
    expect(updatedModeCart.deliveryMode?.code).toBe(modes[1].code);
    expect(updatedModeCart.deliveryCost?.value).toBe(19.99);

    // 5. Verify getCart preserves delivery mode and recalculates totals
    const cartAfterMode = await cartAdapter.getCart(guestCartId);
    expect(cartAfterMode?.deliveryMode?.code).toBe(modes[1].code);
    expect(cartAfterMode?.deliveryCost?.value).toBe(19.99);

    // 6. Set payment details
    const updatedPaymentCart = await checkoutAdapter.setPaymentDetails(guestCartId, {
      accountHolderName: 'Guest Customer',
      cardNumber: '4111111111114242',
      cardType: 'Visa',
      expiryMonth: '10',
      expiryYear: '2027',
    });
    expect(updatedPaymentCart.paymentDetails?.cardNumber).toBe('•••• •••• •••• 4242');

    // 7. Verify getCart preserves payment details
    const cartAfterPayment = await cartAdapter.getCart(guestCartId);
    expect(cartAfterPayment?.paymentDetails?.cardNumber).toBe('•••• •••• •••• 4242');
  });

  it('places an order successfully for a guest cart and clears the active cart', async () => {
    const guestCartId = 'CART-GUEST-electronics-spa';
    await cartAdapter.addToCart(guestCartId, 'CONF-DEMO-001', 2);

    const addresses = await checkoutAdapter.getDeliveryAddresses();
    await checkoutAdapter.setDeliveryAddress(guestCartId, addresses[0]);
    await checkoutAdapter.setDeliveryMode(guestCartId, 'standard-gross');
    await checkoutAdapter.setPaymentDetails(guestCartId, {
      accountHolderName: 'Alex Morgan',
      cardNumber: '5555444433332222',
      cardType: 'Mastercard',
      expiryMonth: '08',
      expiryYear: '2026',
    });

    const order = await checkoutAdapter.placeOrder(guestCartId);
    expect(order.code).toMatch(/^ORDER-\d+$/);
    expect(order.status).toBe('CONFIRMED');
    expect(order.totalItems).toBe(2);
    expect(order.deliveryAddress.line1).toBe(addresses[0].line1);
    expect(order.paymentDetails.cardNumber).toBe('•••• •••• •••• 2222');

    // Verify order is retrievable via getOrder
    const retrievedOrder = await checkoutAdapter.getOrder(order.code);
    expect(retrievedOrder).not.toBeNull();
    expect(retrievedOrder?.code).toBe(order.code);
    expect(retrievedOrder?.totalItems).toBe(2);

    // Verify cart is cleared
    const cartAfterOrder = await cartAdapter.getCart(guestCartId);
    expect(cartAfterOrder?.entries.length).toBe(0);
    expect(cartAfterOrder?.totalItems).toBe(0);
  });

  it('places order with fallbacks if address or payment were omitted', async () => {
    const guestCartId = 'CART-GUEST-electronics-spa';
    await cartAdapter.addToCart(guestCartId, 'CONF-DEMO-001', 1);

    const order = await checkoutAdapter.placeOrder(guestCartId);
    expect(order.code).toMatch(/^ORDER-\d+$/);
    expect(order.deliveryAddress).toBeDefined();
    expect(order.deliveryMode).toBeDefined();
    expect(order.paymentDetails).toBeDefined();
    expect(order.entries.length).toBe(1);
  });

  it('throws error when placing order with an empty cart', async () => {
    const guestCartId = 'CART-GUEST-electronics-spa';
    await expect(checkoutAdapter.placeOrder(guestCartId)).rejects.toThrow(
      'Cannot place an order with an empty cart.'
    );
  });
});
