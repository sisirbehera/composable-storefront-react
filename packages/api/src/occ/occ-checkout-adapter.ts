import { Address, Cart, DeliveryMode, OccConfig, Order, PaymentDetails } from '@storefront/core';
import { CheckoutAdapter } from '../contracts/checkout-adapter';
import { OccClient } from './occ-client';

export class OccCheckoutAdapter implements CheckoutAdapter {
  private client: OccClient;
  private currentUserId: string = 'current';

  constructor(config: OccConfig) {
    this.client = new OccClient(config);
  }

  async getDeliveryAddresses(userId: string = this.currentUserId): Promise<Address[]> {
    try {
      const raw = await this.client.fetch<any>(`users/${userId}/addresses`);
      return (raw.addresses || []).map((a: any) => ({
        id: a.id,
        firstName: a.firstName,
        lastName: a.lastName,
        line1: a.line1,
        line2: a.line2,
        city: a.town || a.city,
        postalCode: a.postalCode,
        country: a.country?.name || 'United States',
        phone: a.phone,
        defaultAddress: a.defaultAddress,
      }));
    } catch (err) {
      console.warn('[OccCheckoutAdapter] Failed to fetch delivery addresses:', err);
      return [];
    }
  }

  async setDeliveryAddress(cartId: string, address: Address): Promise<Cart> {
    const userId = this.currentUserId;
    await this.client.fetch<any>(`users/${userId}/carts/${cartId}/addresses/delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: address.firstName,
        lastName: address.lastName,
        line1: address.line1,
        line2: address.line2,
        town: address.city,
        postalCode: address.postalCode,
        country: { isocode: 'US' },
        phone: address.phone,
      }),
    });
    return this.client.fetch<Cart>(`users/${userId}/carts/${cartId}`);
  }

  async getSupportedDeliveryModes(cartId: string): Promise<DeliveryMode[]> {
    const userId = this.currentUserId;
    try {
      const raw = await this.client.fetch<any>(`users/${userId}/carts/${cartId}/deliverymodes`);
      return (raw.deliveryModes || []).map((m: any) => ({
        code: m.code,
        name: m.name,
        description: m.description,
        deliveryCost: {
          currencyIso: m.deliveryCost?.currencyIso || 'USD',
          value: m.deliveryCost?.value || 0,
          formattedValue: m.deliveryCost?.formattedValue || '$0.00',
        },
      }));
    } catch (err) {
      return [];
    }
  }

  async setDeliveryMode(cartId: string, deliveryModeCode: string): Promise<Cart> {
    const userId = this.currentUserId;
    await this.client.fetch<any>(`users/${userId}/carts/${cartId}/deliverymode`, {
      method: 'PUT',
    }, { deliveryModeId: deliveryModeCode });
    return this.client.fetch<Cart>(`users/${userId}/carts/${cartId}`);
  }

  async setPaymentDetails(cartId: string, paymentDetails: PaymentDetails): Promise<Cart> {
    const userId = this.currentUserId;
    await this.client.fetch<any>(`users/${userId}/carts/${cartId}/paymentdetails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountHolderName: paymentDetails.accountHolderName,
        cardNumber: paymentDetails.cardNumber,
        cardType: { code: paymentDetails.cardType.toLowerCase() },
        expiryMonth: paymentDetails.expiryMonth,
        expiryYear: paymentDetails.expiryYear,
      }),
    });
    return this.client.fetch<Cart>(`users/${userId}/carts/${cartId}`);
  }

  async placeOrder(cartId: string): Promise<Order> {
    const userId = this.currentUserId;
    const raw = await this.client.fetch<any>(`users/${userId}/orders`, {
      method: 'POST',
    }, { cartId });
    return {
      code: raw.code,
      created: raw.created,
      status: raw.status || 'CONFIRMED',
      totalItems: raw.totalUnitCount || 1,
      totalPrice: {
        currencyIso: raw.totalPrice?.currencyIso || 'USD',
        value: raw.totalPrice?.value || 0,
        formattedValue: raw.totalPrice?.formattedValue || '$0.00',
      },
      subTotal: {
        currencyIso: raw.subTotal?.currencyIso || 'USD',
        value: raw.subTotal?.value || 0,
        formattedValue: raw.subTotal?.formattedValue || '$0.00',
      },
      entries: raw.entries || [],
      deliveryAddress: raw.deliveryAddress,
      deliveryMode: raw.deliveryMode,
      paymentDetails: raw.paymentInfo,
    };
  }

  async getOrder(orderCode: string): Promise<Order | null> {
    const userId = this.currentUserId;
    try {
      const raw = await this.client.fetch<any>(`users/${userId}/orders/${orderCode}`);
      return raw as Order;
    } catch (err) {
      return null;
    }
  }
}
