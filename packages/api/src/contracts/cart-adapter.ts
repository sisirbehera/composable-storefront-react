import { Cart } from '@storefront/core';

export interface CartAdapter {
  getCart(cartId: string): Promise<Cart | null>;
  createCart(userId?: string): Promise<Cart>;
  addToCart(cartId: string, productCode: string, quantity: number): Promise<Cart>;
  updateCartEntry(cartId: string, entryNumber: number, quantity: number): Promise<Cart>;
  removeCartEntry(cartId: string, entryNumber: number): Promise<Cart>;
  applyCoupon(cartId: string, couponCode: string): Promise<Cart>;
  removeCoupon(cartId: string, couponCode: string): Promise<Cart>;
  clearCart?(cartId: string): Promise<Cart>;
  mergeCarts?(sourceCartId: string, targetCartId: string): Promise<Cart>;
  saveCart?(cart: Cart): Promise<Cart>;
}
