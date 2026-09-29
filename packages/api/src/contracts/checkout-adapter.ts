import { Address, Cart, DeliveryMode, Order, PaymentDetails } from '@storefront/core';

export interface CheckoutAdapter {
  getDeliveryAddresses(userId?: string): Promise<Address[]>;
  setDeliveryAddress(cartId: string, address: Address): Promise<Cart>;
  getSupportedDeliveryModes(cartId: string): Promise<DeliveryMode[]>;
  setDeliveryMode(cartId: string, deliveryModeCode: string): Promise<Cart>;
  setPaymentDetails(cartId: string, paymentDetails: PaymentDetails): Promise<Cart>;
  placeOrder(cartId: string): Promise<Order>;
  getOrder(orderCode: string): Promise<Order | null>;
}
