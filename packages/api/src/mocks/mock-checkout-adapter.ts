import { Address, Cart, DeliveryMode, Order, PaymentDetails } from '@storefront/core';
import { CheckoutAdapter } from '../contracts/checkout-adapter';
import { CartAdapter } from '../contracts/cart-adapter';
import { mockProducts } from './fixtures/products.fixture';

// Global in-memory storage preserved across instances
const globalOrdersStore: Map<string, Order> = new Map();

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) return (globalThis as any).localStorage;
  return null;
}

export class MockCheckoutAdapter implements CheckoutAdapter {
  private cartAdapter: CartAdapter;
  private savedAddresses: Address[] = [
    {
      id: 'ADDR-001',
      firstName: 'Alex',
      lastName: 'Morgan',
      line1: '100 Silicon Valley Way',
      line2: 'Suite 400',
      city: 'San Jose',
      postalCode: '95134',
      country: 'United States',
      phone: '+1 (408) 555-0199',
      defaultAddress: true,
    },
    {
      id: 'ADDR-002',
      firstName: 'Alex',
      lastName: 'Morgan',
      line1: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      country: 'United States',
      phone: '+1 (541) 555-0123',
      defaultAddress: false,
    },
  ];

  private deliveryModes: DeliveryMode[] = [
    {
      code: 'standard-gross',
      name: 'Standard Ground Delivery',
      description: 'Reliable ground shipping delivered to your doorstep.',
      estimatedDelivery: '3 - 5 Business Days',
      deliveryCost: {
        currencyIso: 'USD',
        value: 0,
        formattedValue: 'Free',
      },
    },
    {
      code: 'premium-gross',
      name: 'Express Priority Air',
      description: 'Expedited air courier with real-time GPS tracking.',
      estimatedDelivery: '1 - 2 Business Days',
      deliveryCost: {
        currencyIso: 'USD',
        value: 19.99,
        formattedValue: '$19.99',
      },
    },
  ];

  constructor(cartAdapter: CartAdapter) {
    this.cartAdapter = cartAdapter;
  }

  async getDeliveryAddresses(userId?: string): Promise<Address[]> {
    return JSON.parse(JSON.stringify(this.savedAddresses));
  }

  async setDeliveryAddress(cartId: string, address: Address): Promise<Cart> {
    const cart = await this.cartAdapter.getCart(cartId);
    if (!cart) throw new Error(`Cart not found: ${cartId}`);

    cart.deliveryAddress = JSON.parse(JSON.stringify(address));

    // If new address not in saved list, add it
    if (!address.id) {
      address.id = `ADDR-${Date.now()}`;
      this.savedAddresses.push({ ...address });
    }

    if (typeof (this.cartAdapter as any).saveCart === 'function') {
      await (this.cartAdapter as any).saveCart(cart);
    }

    return cart;
  }

  async getSupportedDeliveryModes(cartId: string): Promise<DeliveryMode[]> {
    return JSON.parse(JSON.stringify(this.deliveryModes));
  }

  async setDeliveryMode(cartId: string, deliveryModeCode: string): Promise<Cart> {
    const cart = await this.cartAdapter.getCart(cartId);
    if (!cart) throw new Error(`Cart not found: ${cartId}`);

    const mode = this.deliveryModes.find((m) => m.code === deliveryModeCode);
    if (!mode) throw new Error(`Delivery mode not found: ${deliveryModeCode}`);

    cart.deliveryMode = JSON.parse(JSON.stringify(mode));

    // Re-trigger recalculation through updateCartEntry trick or direct price recalc
    const subTotalVal = cart.subTotal?.value || 0;
    const discountVal = cart.totalDiscounts?.value || 0;
    const hasFreeShip = cart.appliedVouchers?.some((v) => v.code.toUpperCase() === 'FREESHIP');
    const shippingVal = hasFreeShip ? 0 : (mode.deliveryCost?.value || 0);

    const currencyIso = cart.totalPrice?.currencyIso || 'USD';
    const currencySymbol = currencyIso === 'EUR' ? '€' : currencyIso === 'GBP' ? '£' : '$';

    cart.deliveryCost = {
      currencyIso,
      value: shippingVal,
      formattedValue: shippingVal === 0 ? 'Free' : `${currencySymbol}${shippingVal.toFixed(2)}`,
    };

    const taxVal = Math.max(0, (subTotalVal - discountVal) * 0.08);
    const finalTotal = Math.max(0, subTotalVal - discountVal + shippingVal + taxVal);

    cart.totalTax = {
      currencyIso,
      value: taxVal,
      formattedValue: `${currencySymbol}${taxVal.toFixed(2)}`,
    };

    cart.totalPrice = {
      currencyIso,
      value: finalTotal,
      formattedValue: `${currencySymbol}${finalTotal.toFixed(2)}`,
    };

    if (typeof (this.cartAdapter as any).saveCart === 'function') {
      await (this.cartAdapter as any).saveCart(cart);
    }

    return cart;
  }

  async setPaymentDetails(cartId: string, paymentDetails: PaymentDetails): Promise<Cart> {
    const cart = await this.cartAdapter.getCart(cartId);
    if (!cart) throw new Error(`Cart not found: ${cartId}`);

    // Mask card number and attach mock token
    const rawNumber = paymentDetails.cardNumber?.replace(/\s+/g, '') || '1111';
    const last4 = rawNumber.slice(-4) || '1111';
    const maskedNumber = `•••• •••• •••• ${last4}`;

    const securedPayment: PaymentDetails = {
      ...paymentDetails,
      id: `PAY-${Date.now()}`,
      cardNumber: maskedNumber,
      token: `tok_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      cvv: undefined, // Never persist CVV
    };

    cart.paymentDetails = securedPayment;

    if (typeof (this.cartAdapter as any).saveCart === 'function') {
      await (this.cartAdapter as any).saveCart(cart);
    }

    return cart;
  }

  async placeOrder(cartId: string): Promise<Order> {
    const cart = await this.cartAdapter.getCart(cartId);
    if (!cart) throw new Error(`Cart not found: ${cartId}`);

    if (cart.entries.length === 0) {
      throw new Error('Cannot place an order with an empty cart.');
    }

    if (!cart.deliveryAddress) {
      cart.deliveryAddress = JSON.parse(JSON.stringify(this.savedAddresses[0]));
    }

    if (!cart.deliveryMode) {
      cart.deliveryMode = JSON.parse(JSON.stringify(this.deliveryModes[0]));
    }

    if (!cart.paymentDetails) {
      cart.paymentDetails = {
        accountHolderName: 'Alex Morgan',
        cardNumber: '•••• •••• •••• 4242',
        cardType: 'Visa',
        expiryMonth: '12',
        expiryYear: '2028',
        token: `tok_${Date.now()}`,
      };
    }

    const orderNumber = `ORDER-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      code: orderNumber,
      guid: `guid-${orderNumber.toLowerCase()}`,
      created: new Date().toISOString(),
      status: 'CONFIRMED',
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice || { currencyIso: 'USD', value: 0, formattedValue: '$0.00' },
      subTotal: cart.subTotal || { currencyIso: 'USD', value: 0, formattedValue: '$0.00' },
      totalDiscounts: cart.totalDiscounts,
      deliveryCost: cart.deliveryCost || { currencyIso: 'USD', value: 0, formattedValue: 'Free' },
      totalTax: cart.totalTax || { currencyIso: 'USD', value: 0, formattedValue: '$0.00' },
      entries: JSON.parse(JSON.stringify(cart.entries)),
      deliveryAddress: JSON.parse(JSON.stringify(cart.deliveryAddress)),
      deliveryMode: JSON.parse(JSON.stringify(cart.deliveryMode)),
      paymentDetails: JSON.parse(JSON.stringify(cart.paymentDetails)),
      appliedVouchers: cart.appliedVouchers ? JSON.parse(JSON.stringify(cart.appliedVouchers)) : [],
    };

    // Store in global memory
    globalOrdersStore.set(orderNumber, newOrder);

    // Save to localStorage
    const storage = getStorage();
    if (storage) {
      try {
        storage.setItem(`order_${orderNumber}`, JSON.stringify(newOrder));
        storage.setItem('latest_order', JSON.stringify(newOrder));

        // Also add to storefront_mock_orders list for order history page
        const existingOrdersJson = storage.getItem('storefront_mock_orders');
        const ordersList: Order[] = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];
        ordersList.unshift(newOrder);
        storage.setItem('storefront_mock_orders', JSON.stringify(ordersList));
      } catch (err) {
        console.warn('Could not save order to localStorage', err);
      }
    }

    // Reset the cart for new purchases
    if (typeof (this.cartAdapter as any).clearCart === 'function') {
      await (this.cartAdapter as any).clearCart(cartId);
    } else {
      cart.entries = [];
      cart.totalItems = 0;
      cart.totalPrice = { currencyIso: 'USD', value: 0, formattedValue: '$0.00' };
      cart.subTotal = { currencyIso: 'USD', value: 0, formattedValue: '$0.00' };
      cart.totalDiscounts = { currencyIso: 'USD', value: 0, formattedValue: '$0.00' };
      cart.deliveryCost = { currencyIso: 'USD', value: 0, formattedValue: '$0.00' };
      cart.totalTax = { currencyIso: 'USD', value: 0, formattedValue: '$0.00' };
      cart.appliedVouchers = [];
      if (typeof (this.cartAdapter as any).saveCart === 'function') {
        await (this.cartAdapter as any).saveCart(cart);
      }
    }

    return newOrder;
  }

  async getOrder(orderCode: string): Promise<Order | null> {
    // 1. Check in-memory store
    if (globalOrdersStore.has(orderCode)) {
      return JSON.parse(JSON.stringify(globalOrdersStore.get(orderCode)));
    }

    // 2. Check localStorage if available
    const storage = getStorage();
    if (storage) {
      try {
        const stored = storage.getItem(`order_${orderCode}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          globalOrdersStore.set(orderCode, parsed);
          return parsed;
        }

        const latest = storage.getItem('latest_order');
        if (latest) {
          const parsed = JSON.parse(latest);
          if (parsed.code === orderCode || !orderCode || orderCode === 'ORDER-XXXXXX' || orderCode === 'latest') {
            return parsed;
          }
        }

        const ordersListJson = storage.getItem('storefront_mock_orders');
        if (ordersListJson) {
          const list: Order[] = JSON.parse(ordersListJson);
          const found = list.find((o) => o.code === orderCode);
          if (found) {
            globalOrdersStore.set(orderCode, found);
            return found;
          }
        }
      } catch (err) {
        console.warn('Could not load order from localStorage', err);
      }
    }

    // 3. Fallback mock order if code looks like an order (prevents 404 on direct URLs or SSR)
    const demoProduct = mockProducts[0];
    const fallbackOrder: Order = {
      code: orderCode || 'ORDER-DEMO-001',
      guid: `guid-${orderCode.toLowerCase()}`,
      created: new Date().toISOString(),
      status: 'CONFIRMED',
      totalItems: 1,
      totalPrice: {
        currencyIso: 'USD',
        value: 431.99,
        formattedValue: '$431.99',
      },
      subTotal: {
        currencyIso: 'USD',
        value: 399.99,
        formattedValue: '$399.99',
      },
      totalTax: {
        currencyIso: 'USD',
        value: 32.00,
        formattedValue: '$32.00',
      },
      deliveryCost: {
        currencyIso: 'USD',
        value: 0,
        formattedValue: 'Free',
      },
      entries: [
        {
          entryNumber: 0,
          quantity: 1,
          product: demoProduct,
          basePrice: demoProduct.price!,
          totalPrice: demoProduct.price!,
        },
      ],
      deliveryAddress: this.savedAddresses[0],
      deliveryMode: this.deliveryModes[0],
      paymentDetails: {
        accountHolderName: 'Alex Morgan',
        cardNumber: '•••• •••• •••• 4444',
        cardType: 'Visa',
        expiryMonth: '12',
        expiryYear: '2028',
        token: 'tok_demo_confirmed_123',
      },
      appliedVouchers: [],
    };

    return fallbackOrder;
  }
}
