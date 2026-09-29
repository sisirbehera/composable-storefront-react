import { Cart, OrderEntry, Voucher } from '@storefront/core';
import { CartAdapter } from '../contracts/cart-adapter';
import {
  mockProducts,
  apparelProducts,
  powertoolsProducts,
  getAllMockProducts,
} from './fixtures/products.fixture';
import { measureAdapterCall } from '../logger/adapter-logger';

const STORAGE_KEY_CARTS = 'storefront_mock_carts';

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) return (globalThis as any).localStorage;
  return null;
}

function loadStoredCarts(): Map<string, Cart> | null {
  const storage = getStorage();
  if (storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY_CARTS);
      if (raw) {
        const obj = JSON.parse(raw);
        return new Map(Object.entries(obj));
      }
    } catch {
      // ignore
    }
  }
  return null;
}

function saveStoredCarts(carts: Map<string, Cart>): void {
  const storage = getStorage();
  if (storage) {
    try {
      const obj = Object.fromEntries(carts.entries());
      storage.setItem(STORAGE_KEY_CARTS, JSON.stringify(obj));
    } catch {
      // ignore
    }
  }
}

export class MockCartAdapter implements CartAdapter {
  private carts: Map<string, Cart> = new Map();

  constructor() {
    const stored = loadStoredCarts();
    if (stored && stored.size > 0) {
      this.carts = stored;
    } else {
      this.seedDemoCarts();
      saveStoredCarts(this.carts);
    }
  }

  public persist(): void {
    saveStoredCarts(this.carts);
  }

  public async saveCart(cart: Cart): Promise<Cart> {
    this.carts.set(cart.code, cart);
    this.persist();
    return cart;
  }

  public resetDemoCarts(): void {
    this.carts.clear();
    this.seedDemoCarts();
    this.persist();
  }

  private seedDemoCarts() {
    // 1. Electronics Cart (USD)
    const electronicsProduct = mockProducts[0];
    const electronicsCart: Cart = {
      code: 'CART-DEMO-electronics-spa',
      guid: 'CART-DEMO-electronics-spa',
      totalItems: 1,
      totalPrice: {
        currencyIso: 'USD',
        value: electronicsProduct.price?.value || 399.99,
        formattedValue: electronicsProduct.price?.formattedValue || '$399.99',
      },
      subTotal: {
        currencyIso: 'USD',
        value: electronicsProduct.price?.value || 399.99,
        formattedValue: electronicsProduct.price?.formattedValue || '$399.99',
      },
      totalDiscounts: {
        currencyIso: 'USD',
        value: 0,
        formattedValue: '$0.00',
      },
      deliveryCost: {
        currencyIso: 'USD',
        value: 0,
        formattedValue: '$0.00',
      },
      entries: [
        {
          entryNumber: 0,
          quantity: 1,
          product: electronicsProduct,
          basePrice: electronicsProduct.price!,
          totalPrice: electronicsProduct.price!,
          updateable: true,
        },
      ],
      appliedVouchers: [],
    };
    this.carts.set('CART-DEMO-electronics-spa', electronicsCart);
    this.carts.set('CART-DEMO-001', electronicsCart);

    // 2. Apparel UK Cart (GBP)
    const apparelProduct = apparelProducts[0];
    if (apparelProduct) {
      const apparelCart: Cart = {
        code: 'CART-DEMO-apparel-uk',
        guid: 'CART-DEMO-apparel-uk',
        totalItems: 1,
        totalPrice: {
          currencyIso: 'GBP',
          value: apparelProduct.price?.value || 1895.0,
          formattedValue: apparelProduct.price?.formattedValue || '£1,895.00',
        },
        subTotal: {
          currencyIso: 'GBP',
          value: apparelProduct.price?.value || 1895.0,
          formattedValue: apparelProduct.price?.formattedValue || '£1,895.00',
        },
        totalDiscounts: {
          currencyIso: 'GBP',
          value: 0,
          formattedValue: '£0.00',
        },
        deliveryCost: {
          currencyIso: 'GBP',
          value: 0,
          formattedValue: '£0.00',
        },
        entries: [
          {
            entryNumber: 0,
            quantity: 1,
            product: apparelProduct,
            basePrice: apparelProduct.price!,
            totalPrice: apparelProduct.price!,
            updateable: true,
          },
        ],
        appliedVouchers: [],
      };
      this.carts.set('CART-DEMO-apparel-uk', apparelCart);
    }

    // 3. Powertools B2B Cart (USD)
    const powertoolsProduct = powertoolsProducts[0];
    if (powertoolsProduct) {
      const powertoolsCart: Cart = {
        code: 'CART-DEMO-powertools-spa',
        guid: 'CART-DEMO-powertools-spa',
        totalItems: 1,
        totalPrice: {
          currencyIso: 'USD',
          value: powertoolsProduct.price?.value || 329.0,
          formattedValue: powertoolsProduct.price?.formattedValue || '$329.00',
        },
        subTotal: {
          currencyIso: 'USD',
          value: powertoolsProduct.price?.value || 329.0,
          formattedValue: powertoolsProduct.price?.formattedValue || '$329.00',
        },
        totalDiscounts: {
          currencyIso: 'USD',
          value: 0,
          formattedValue: '$0.00',
        },
        deliveryCost: {
          currencyIso: 'USD',
          value: 0,
          formattedValue: '$0.00',
        },
        entries: [
          {
            entryNumber: 0,
            quantity: 1,
            product: powertoolsProduct,
            basePrice: powertoolsProduct.price!,
            totalPrice: powertoolsProduct.price!,
            updateable: true,
          },
        ],
        appliedVouchers: [],
      };
      this.carts.set('CART-DEMO-powertools-spa', powertoolsCart);
    }
  }

  private recalculateCart(cart: Cart): Cart {
    let totalItems = 0;
    let subTotalValue = 0;

    const currencyIso = cart.entries[0]?.basePrice?.currencyIso || cart.totalPrice?.currencyIso || 'USD';
    const symbol = currencyIso === 'EUR' ? '€' : currencyIso === 'GBP' ? '£' : currencyIso === 'JPY' ? '¥' : '$';
    const decimals = currencyIso === 'JPY' ? 0 : 2;

    cart.entries.forEach((entry, idx) => {
      entry.entryNumber = idx;
      totalItems += entry.quantity;
      const unitVal = entry.basePrice.value;
      const entryVal = unitVal * entry.quantity;
      entry.totalPrice = {
        ...entry.basePrice,
        currencyIso,
        value: entryVal,
        formattedValue: `${symbol}${entryVal.toFixed(decimals)}`,
      };
      subTotalValue += entryVal;
    });

    cart.totalItems = totalItems;
    cart.subTotal = {
      currencyIso,
      value: subTotalValue,
      formattedValue: `${symbol}${subTotalValue.toFixed(decimals)}`,
    };

    // Calculate vouchers/discounts
    let totalDiscountVal = 0;
    const applied = cart.appliedVouchers || [];

    applied.forEach((v) => {
      if (v.code.toUpperCase() === 'SAVE20') {
        const discount = subTotalValue * 0.2;
        v.discountAmount = {
          currencyIso,
          value: discount,
          formattedValue: `-${symbol}${discount.toFixed(decimals)}`,
        };
        totalDiscountVal += discount;
      } else if (v.code.toUpperCase() === 'DISCOUNT10') {
        const discount = Math.min(10, subTotalValue);
        v.discountAmount = {
          currencyIso,
          value: discount,
          formattedValue: `-${symbol}${discount.toFixed(decimals)}`,
        };
        totalDiscountVal += discount;
      }
    });

    cart.totalDiscounts = {
      currencyIso,
      value: totalDiscountVal,
      formattedValue: `-${symbol}${totalDiscountVal.toFixed(decimals)}`,
    };

    // Delivery cost
    let deliveryVal = cart.deliveryMode?.deliveryCost?.value || 0;
    const hasFreeShip = applied.some((v) => v.code.toUpperCase() === 'FREESHIP');
    if (hasFreeShip) {
      deliveryVal = 0;
    }
    cart.deliveryCost = {
      currencyIso,
      value: deliveryVal,
      formattedValue: deliveryVal === 0 ? 'Free' : `${symbol}${deliveryVal.toFixed(decimals)}`,
    };

    // Total tax (estimated 8% on discounted subtotal)
    const taxableAmount = Math.max(0, subTotalValue - totalDiscountVal);
    const taxVal = taxableAmount * 0.08;
    cart.totalTax = {
      currencyIso,
      value: taxVal,
      formattedValue: `${symbol}${taxVal.toFixed(decimals)}`,
    };

    // Final total
    const finalTotal = Math.max(0, taxableAmount + deliveryVal + taxVal);
    cart.totalPrice = {
      currencyIso,
      value: finalTotal,
      formattedValue: `${symbol}${finalTotal.toFixed(decimals)}`,
    };

    this.persist();
    return cart;
  }

  async getCart(cartId: string): Promise<Cart | null> {
    return measureAdapterCall('CartAdapter', 'getCart', async () => {
      const stored = loadStoredCarts();
      if (stored && stored.size > 0) {
        this.carts = stored;
      }
      if (this.carts.has(cartId)) {
        return this.carts.get(cartId)!;
      }
      if (cartId.includes('GUEST')) {
        const guestCart: Cart = {
          code: cartId,
          guid: cartId,
          totalItems: 0,
          entries: [],
          appliedVouchers: [],
          totalPrice: {
            currencyIso: cartId.includes('apparel-uk') ? 'GBP' : 'USD',
            value: 0,
            formattedValue: cartId.includes('apparel-uk') ? '£0.00' : '$0.00',
          },
          subTotal: {
            currencyIso: cartId.includes('apparel-uk') ? 'GBP' : 'USD',
            value: 0,
            formattedValue: cartId.includes('apparel-uk') ? '£0.00' : '$0.00',
          },
          deliveryCost: {
            currencyIso: cartId.includes('apparel-uk') ? 'GBP' : 'USD',
            value: 0,
            formattedValue: 'Free',
          },
          totalDiscounts: {
            currencyIso: cartId.includes('apparel-uk') ? 'GBP' : 'USD',
            value: 0,
            formattedValue: cartId.includes('apparel-uk') ? '£0.00' : '$0.00',
          },
        };
        this.carts.set(cartId, guestCart);
        this.persist();
        return guestCart;
      }
      if (cartId.includes('apparel-uk')) {
        return this.carts.get('CART-DEMO-apparel-uk') || null;
      }
      if (cartId.includes('powertools-spa')) {
        return this.carts.get('CART-DEMO-powertools-spa') || null;
      }
      return this.carts.get('CART-DEMO-electronics-spa') || this.carts.get('CART-DEMO-001') || null;
    }, { cartId });
  }

  async createCart(userId?: string): Promise<Cart> {
    const code = `CART-${Date.now().toString(36).toUpperCase()}`;
    const newCart: Cart = {
      code,
      guid: code,
      totalItems: 0,
      entries: [],
      appliedVouchers: [],
    };
    this.carts.set(code, newCart);
    this.persist();
    return newCart;
  }

  async addToCart(cartId: string, productCode: string, quantity: number): Promise<Cart> {
    return measureAdapterCall('CartAdapter', 'addToCart', async () => {
      let cart = this.carts.get(cartId);
      if (!cart) {
        if (cartId.includes('GUEST')) {
          cart = {
            code: cartId,
            guid: cartId,
            totalItems: 0,
            entries: [],
            appliedVouchers: [],
          };
          this.carts.set(cartId, cart);
        } else if (cartId.includes('apparel-uk') && this.carts.has('CART-DEMO-apparel-uk')) {
          cart = this.carts.get('CART-DEMO-apparel-uk')!;
        } else if (cartId.includes('powertools-spa') && this.carts.has('CART-DEMO-powertools-spa')) {
          cart = this.carts.get('CART-DEMO-powertools-spa')!;
        } else if (this.carts.has('CART-DEMO-electronics-spa')) {
          cart = this.carts.get('CART-DEMO-electronics-spa')!;
        } else {
          cart = await this.createCart();
          cart.code = cartId;
          cart.guid = cartId;
          this.carts.set(cartId, cart);
        }
      }

      const allProducts = getAllMockProducts();
      const product = allProducts.find((p) => p.code === productCode);
      if (!product) {
        throw new Error(`Product not found: ${productCode}`);
      }

      const existingEntry = cart.entries.find((e) => e.product.code === productCode);
      if (existingEntry) {
        existingEntry.quantity += quantity;
      } else {
        const newEntry: OrderEntry = {
          entryNumber: cart.entries.length,
          quantity,
          product,
          basePrice: product.price!,
          totalPrice: product.price!,
          updateable: true,
        };
        cart.entries.push(newEntry);
      }

      return this.recalculateCart(cart);
    }, { cartId, productCode, quantity });
  }

  async updateCartEntry(cartId: string, entryNumber: number, quantity: number): Promise<Cart> {
    return measureAdapterCall('CartAdapter', 'updateCartEntry', async () => {
      const cart = await this.getCart(cartId);
      if (!cart) throw new Error(`Cart not found: ${cartId}`);

      const entry = cart.entries.find((e) => e.entryNumber === entryNumber);
      if (!entry) throw new Error(`Entry not found: ${entryNumber}`);

      if (quantity <= 0) {
        return this.removeCartEntry(cartId, entryNumber);
      }

      entry.quantity = quantity;
      return this.recalculateCart(cart);
    }, { cartId, entryNumber, quantity });
  }

  async removeCartEntry(cartId: string, entryNumber: number): Promise<Cart> {
    return measureAdapterCall('CartAdapter', 'removeCartEntry', async () => {
      const cart = await this.getCart(cartId);
      if (!cart) throw new Error(`Cart not found: ${cartId}`);

      cart.entries = cart.entries.filter((e) => e.entryNumber !== entryNumber);
      return this.recalculateCart(cart);
    }, { cartId, entryNumber });
  }

  async applyCoupon(cartId: string, couponCode: string): Promise<Cart> {
    return measureAdapterCall('CartAdapter', 'applyCoupon', async () => {
      const cart = await this.getCart(cartId);
      if (!cart) throw new Error(`Cart not found: ${cartId}`);

      const code = couponCode.trim().toUpperCase();
      if (!cart.appliedVouchers) {
        cart.appliedVouchers = [];
      }

      if (cart.appliedVouchers.some((v) => v.code.toUpperCase() === code)) {
        throw new Error(`Coupon "${code}" is already applied.`);
      }

      let voucher: Voucher;
      if (code === 'SAVE20') {
        voucher = {
          code: 'SAVE20',
          name: '20% Off Spring Promotion',
          description: 'Enjoy 20% discount on your order subtotal.',
          discountPercent: 20,
          applied: true,
        };
      } else if (code === 'FREESHIP') {
        voucher = {
          code: 'FREESHIP',
          name: 'Free Express Shipping',
          description: 'Free shipping on any order.',
          applied: true,
        };
      } else if (code === 'DISCOUNT10') {
        voucher = {
          code: 'DISCOUNT10',
          name: '$10 Welcome Voucher',
          description: '$10 off entire purchase.',
          applied: true,
        };
      } else {
        throw new Error(`Invalid or expired coupon code "${couponCode}". Try SAVE20 or FREESHIP.`);
      }

      cart.appliedVouchers.push(voucher);
      return this.recalculateCart(cart);
    }, { cartId, couponCode });
  }

  async removeCoupon(cartId: string, couponCode: string): Promise<Cart> {
    return measureAdapterCall('CartAdapter', 'removeCoupon', async () => {
      const cart = await this.getCart(cartId);
      if (!cart) throw new Error(`Cart not found: ${cartId}`);

      if (cart.appliedVouchers) {
        cart.appliedVouchers = cart.appliedVouchers.filter(
          (v) => v.code.toUpperCase() !== couponCode.trim().toUpperCase()
        );
      }

      return this.recalculateCart(cart);
    }, { cartId, couponCode });
  }

  async clearCart(cartId: string): Promise<Cart> {
    return measureAdapterCall('CartAdapter', 'clearCart', async () => {
      let cart = this.carts.get(cartId);
      const currencyIso = cart?.totalPrice?.currencyIso || (cartId.includes('apparel-uk') ? 'GBP' : 'USD');
      const symbol = currencyIso === 'GBP' ? '£' : '$';

      if (!cart) {
        cart = {
          code: cartId,
          guid: cartId,
          totalItems: 0,
          entries: [],
          appliedVouchers: [],
        };
      } else {
        cart.entries = [];
        cart.totalItems = 0;
        cart.appliedVouchers = [];
      }

      cart.totalPrice = {
        currencyIso,
        value: 0,
        formattedValue: `${symbol}0.00`,
      };
      cart.subTotal = {
        currencyIso,
        value: 0,
        formattedValue: `${symbol}0.00`,
      };
      cart.totalDiscounts = {
        currencyIso,
        value: 0,
        formattedValue: `${symbol}0.00`,
      };
      cart.deliveryCost = {
        currencyIso,
        value: 0,
        formattedValue: 'Free',
      };

      this.carts.set(cartId, cart);
      this.persist();
      return cart;
    }, { cartId });
  }

  async mergeCarts(sourceCartId: string, targetCartId: string): Promise<Cart> {
    return measureAdapterCall('CartAdapter', 'mergeCarts', async () => {
      const sourceCart = await this.getCart(sourceCartId);
      const targetCart = (await this.getCart(targetCartId)) || (await this.createCart());
      targetCart.code = targetCartId;
      targetCart.guid = targetCartId;

      if (sourceCart && sourceCart.entries && sourceCart.entries.length > 0) {
        for (const entry of sourceCart.entries) {
          const existing = targetCart.entries.find((e) => e.product.code === entry.product.code);
          if (existing) {
            existing.quantity += entry.quantity;
          } else {
            targetCart.entries.push({
              ...entry,
              entryNumber: targetCart.entries.length,
            });
          }
        }
        // Reset source guest cart after merging entries
        await this.clearCart(sourceCartId);
      }

      this.carts.set(targetCartId, targetCart);
      return this.recalculateCart(targetCart);
    }, { sourceCartId, targetCartId });
  }
}

