import {
  Address,
  AuthToken,
  OccConfig,
  Order,
  OrderHistoryList,
  PasswordChangeRequest,
  PaymentDetails,
  User,
  UserRegistration,
} from '@storefront/core';
import { UserAdapter } from '../contracts/user-adapter';
import { OccClient } from './occ-client';

export class OccUserAdapter implements UserAdapter {
  private client: OccClient;

  constructor(occConfig: OccConfig) {
    this.client = new OccClient(occConfig);
  }

  async login(username: string, password?: string): Promise<{ user: User; token: AuthToken }> {
    // 1. Fetch OAuth token using Resource Owner Password Credentials
    const tokenUrl = `${this.client['config'].baseUrl}/authorizationserver/oauth/token`;
    const params = new URLSearchParams({
      grant_type: 'password',
      client_id: this.client['config'].clientId || 'mobile_android',
      client_secret: this.client['config'].clientSecret || 'secret',
      username,
      password: password || '',
    });

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      throw new Error(`Login failed: ${res.statusText}`);
    }

    const tokenData = await res.json();
    const token: AuthToken = {
      ...tokenData,
      expires_at: Date.now() + tokenData.expires_in * 1000,
    };

    // 2. Fetch user profile
    const user = await this.getUser('current');
    if (!user) {
      throw new Error('Failed to retrieve user profile after authentication.');
    }

    return { user, token };
  }

  async register(registration: UserRegistration): Promise<{ user: User; token: AuthToken }> {
    await this.client.post('/users', {
      titleCode: registration.titleCode || 'mr',
      firstName: registration.firstName,
      lastName: registration.lastName,
      uid: registration.email,
      password: registration.password,
    });

    return this.login(registration.email, registration.password);
  }

  async getUser(userId: string): Promise<User | null> {
    const raw = await this.client.get<any>(`/users/${encodeURIComponent(userId)}`);
    if (!raw) return null;

    return {
      uid: raw.uid,
      name: raw.name,
      firstName: raw.firstName,
      lastName: raw.lastName,
      displayUid: raw.displayUid || raw.uid,
      titleCode: raw.titleCode,
      defaultAddressId: raw.defaultAddress?.id,
      currency: raw.currency,
      language: raw.language,
    };
  }

  async updateUser(userId: string, user: Partial<User>): Promise<User> {
    const raw = await this.client.put<any>(`/users/${encodeURIComponent(userId)}`, user);
    return {
      uid: raw.uid || userId,
      name: raw.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      firstName: raw.firstName || user.firstName,
      lastName: raw.lastName || user.lastName,
      displayUid: raw.displayUid || user.displayUid,
      titleCode: raw.titleCode || user.titleCode,
      currency: raw.currency,
      language: raw.language,
    };
  }

  async changePassword(userId: string, request: PasswordChangeRequest): Promise<void> {
    await this.client.put(`/users/${encodeURIComponent(userId)}/password`, {
      old: request.oldPassword,
      new: request.newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.client.post('/forgottenpasswordtokens', {
      userId: email,
    });
  }

  // Address Book
  async getAddresses(userId: string): Promise<Address[]> {
    const data = await this.client.get<{ addresses: any[] }>(
      `/users/${encodeURIComponent(userId)}/addresses`
    );
    return (data?.addresses || []).map((a: any) => ({
      id: a.id,
      titleCode: a.titleCode,
      firstName: a.firstName,
      lastName: a.lastName,
      line1: a.line1,
      line2: a.line2,
      city: a.town,
      postalCode: a.postalCode,
      country: a.country?.name || 'United States',
      phone: a.phone,
      defaultAddress: !!a.defaultAddress,
    }));
  }

  async addAddress(userId: string, address: Address): Promise<Address> {
    const data = await this.client.post<any>(`/users/${encodeURIComponent(userId)}/addresses`, {
      titleCode: address.titleCode || 'mr',
      firstName: address.firstName,
      lastName: address.lastName,
      line1: address.line1,
      line2: address.line2,
      town: address.city,
      postalCode: address.postalCode,
      country: { isocode: 'US' },
      phone: address.phone,
      defaultAddress: address.defaultAddress,
    });
    return {
      ...address,
      id: data?.id || `ADDR-${Date.now()}`,
    };
  }

  async updateAddress(userId: string, addressId: string, address: Address): Promise<Address> {
    await this.client.put(`/users/${encodeURIComponent(userId)}/addresses/${encodeURIComponent(addressId)}`, {
      titleCode: address.titleCode || 'mr',
      firstName: address.firstName,
      lastName: address.lastName,
      line1: address.line1,
      line2: address.line2,
      town: address.city,
      postalCode: address.postalCode,
      phone: address.phone,
      defaultAddress: address.defaultAddress,
    });
    return { ...address, id: addressId };
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    await this.client.delete(
      `/users/${encodeURIComponent(userId)}/addresses/${encodeURIComponent(addressId)}`
    );
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    await this.client.put(
      `/users/${encodeURIComponent(userId)}/addresses/${encodeURIComponent(addressId)}`,
      { defaultAddress: true }
    );
  }

  // Saved Payment Details
  async getPaymentDetails(userId: string): Promise<PaymentDetails[]> {
    const data = await this.client.get<{ payments: any[] }>(
      `/users/${encodeURIComponent(userId)}/paymentdetails`
    );
    return (data?.payments || []).map((p: any) => ({
      id: p.id,
      accountHolderName: p.accountHolderName,
      cardNumber: p.cardNumber,
      cardType: p.cardType?.name || 'Visa',
      expiryMonth: p.expiryMonth,
      expiryYear: p.expiryYear,
      defaultPayment: !!p.defaultPayment,
    }));
  }

  async deletePaymentDetails(userId: string, paymentDetailsId: string): Promise<void> {
    await this.client.delete(
      `/users/${encodeURIComponent(userId)}/paymentdetails/${encodeURIComponent(paymentDetailsId)}`
    );
  }

  // Order History
  async getOrderHistory(
    userId: string,
    pageSize = 5,
    currentPage = 0,
    sort?: string
  ): Promise<OrderHistoryList> {
    const params = new URLSearchParams({
      pageSize: String(pageSize),
      currentPage: String(currentPage),
      sort: sort || 'byDate',
    });

    const data = await this.client.get<any>(
      `/users/${encodeURIComponent(userId)}/orders?${params.toString()}`
    );

    return {
      orders: (data?.orders || []).map((o: any) => ({
        code: o.code,
        guid: o.guid,
        placed: o.placed,
        status: o.status,
        statusDisplay: o.statusDisplay || o.status,
        total: o.total,
        totalItems: o.totalUnitCount || 1,
      })),
      pagination: {
        currentPage: data?.pagination?.currentPage || currentPage,
        pageSize: data?.pagination?.pageSize || pageSize,
        totalPages: data?.pagination?.totalPages || 1,
        totalResults: data?.pagination?.totalResults || 0,
      },
    };
  }

  async getOrderDetails(userId: string, orderCode: string): Promise<Order | null> {
    return this.client.get<Order>(
      `/users/${encodeURIComponent(userId)}/orders/${encodeURIComponent(orderCode)}`
    );
  }
}
