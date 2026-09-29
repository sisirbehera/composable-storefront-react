import {
  Address,
  AuthToken,
  Order,
  OrderHistoryItem,
  OrderHistoryList,
  PasswordChangeRequest,
  PaymentDetails,
  User,
  UserRegistration,
} from '@storefront/core';
import { UserAdapter } from '../contracts/user-adapter';
import { mockProducts } from './fixtures/products.fixture';

export class MockUserAdapter implements UserAdapter {
  private user: User = {
    uid: 'alex.morgan@example.com',
    name: 'Alex Morgan',
    firstName: 'Alex',
    lastName: 'Morgan',
    displayUid: 'alex.morgan@example.com',
    titleCode: 'mr',
    defaultAddressId: 'ADDR-001',
    defaultPaymentInfoId: 'PAY-001',
    currency: { isocode: 'USD', symbol: '$' },
    language: { isocode: 'en', name: 'English' },
  };

  private addresses: Address[] = [
    {
      id: 'ADDR-001',
      titleCode: 'mr',
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
      titleCode: 'mr',
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

  private paymentMethods: PaymentDetails[] = [
    {
      id: 'PAY-001',
      accountHolderName: 'Alex Morgan',
      cardNumber: '•••• •••• •••• 4444',
      cardType: 'Visa',
      expiryMonth: '12',
      expiryYear: '2028',
      defaultPayment: true,
    },
    {
      id: 'PAY-002',
      accountHolderName: 'Alex Morgan',
      cardNumber: '•••• •••• •••• 8821',
      cardType: 'Mastercard',
      expiryMonth: '08',
      expiryYear: '2027',
      defaultPayment: false,
    },
  ];

  private orders: Order[] = [
    {
      code: 'ORDER-100421',
      guid: 'guid-order-100421',
      created: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      status: 'DELIVERED',
      totalItems: 1,
      totalPrice: { currencyIso: 'USD', value: 399.99, formattedValue: '$399.99' },
      subTotal: { currencyIso: 'USD', value: 399.99, formattedValue: '$399.99' },
      totalTax: { currencyIso: 'USD', value: 32.0, formattedValue: '$32.00' },
      deliveryCost: { currencyIso: 'USD', value: 0, formattedValue: 'Free' },
      entries: [
        {
          entryNumber: 0,
          quantity: 1,
          product: mockProducts[0],
          basePrice: mockProducts[0].price!,
          totalPrice: mockProducts[0].price!,
        },
      ],
      deliveryAddress: {
        id: 'ADDR-001',
        firstName: 'Alex',
        lastName: 'Morgan',
        line1: '100 Silicon Valley Way',
        city: 'San Jose',
        postalCode: '95134',
        country: 'United States',
      },
      deliveryMode: {
        code: 'standard-gross',
        name: 'Standard Ground Delivery',
        estimatedDelivery: 'Delivered on Sep 17, 2026',
        deliveryCost: { currencyIso: 'USD', value: 0, formattedValue: 'Free' },
      },
      paymentDetails: {
        accountHolderName: 'Alex Morgan',
        cardNumber: '•••• •••• •••• 4444',
        cardType: 'Visa',
        expiryMonth: '12',
        expiryYear: '2028',
      },
    },
    {
      code: 'ORDER-100209',
      guid: 'guid-order-100209',
      created: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      status: 'SHIPPED',
      totalItems: 1,
      totalPrice: { currencyIso: 'USD', value: 249.99, formattedValue: '$249.99' },
      subTotal: { currencyIso: 'USD', value: 249.99, formattedValue: '$249.99' },
      totalTax: { currencyIso: 'USD', value: 20.0, formattedValue: '$20.00' },
      deliveryCost: { currencyIso: 'USD', value: 0, formattedValue: 'Free' },
      entries: [
        {
          entryNumber: 0,
          quantity: 1,
          product: mockProducts[1] || mockProducts[0],
          basePrice: mockProducts[1]?.price || mockProducts[0].price!,
          totalPrice: mockProducts[1]?.price || mockProducts[0].price!,
        },
      ],
      deliveryAddress: {
        id: 'ADDR-001',
        firstName: 'Alex',
        lastName: 'Morgan',
        line1: '100 Silicon Valley Way',
        city: 'San Jose',
        postalCode: '95134',
        country: 'United States',
      },
      deliveryMode: {
        code: 'premium-gross',
        name: 'Express Priority Air',
        estimatedDelivery: 'Estimated Sep 20, 2026',
        deliveryCost: { currencyIso: 'USD', value: 0, formattedValue: 'Free' },
      },
      paymentDetails: {
        accountHolderName: 'Alex Morgan',
        cardNumber: '•••• •••• •••• 8821',
        cardType: 'Mastercard',
        expiryMonth: '08',
        expiryYear: '2027',
      },
    },
    {
      code: 'ORDER-100115',
      guid: 'guid-order-100115',
      created: new Date(Date.now() - 21 * 24 * 3600 * 1000).toISOString(),
      status: 'DELIVERED',
      totalItems: 2,
      totalPrice: { currencyIso: 'USD', value: 829.98, formattedValue: '$829.98' },
      subTotal: { currencyIso: 'USD', value: 829.98, formattedValue: '$829.98' },
      totalTax: { currencyIso: 'USD', value: 66.4, formattedValue: '$66.40' },
      deliveryCost: { currencyIso: 'USD', value: 0, formattedValue: 'Free' },
      entries: [
        {
          entryNumber: 0,
          quantity: 1,
          product: mockProducts[0],
          basePrice: mockProducts[0].price!,
          totalPrice: mockProducts[0].price!,
        },
        {
          entryNumber: 1,
          quantity: 1,
          product: mockProducts[2] || mockProducts[0],
          basePrice: mockProducts[2]?.price || mockProducts[0].price!,
          totalPrice: mockProducts[2]?.price || mockProducts[0].price!,
        },
      ],
      deliveryAddress: {
        id: 'ADDR-002',
        firstName: 'Alex',
        lastName: 'Morgan',
        line1: '742 Evergreen Terrace',
        city: 'Springfield',
        postalCode: '97477',
        country: 'United States',
      },
      deliveryMode: {
        code: 'standard-gross',
        name: 'Standard Ground Delivery',
        estimatedDelivery: 'Delivered Aug 29, 2026',
        deliveryCost: { currencyIso: 'USD', value: 0, formattedValue: 'Free' },
      },
      paymentDetails: {
        accountHolderName: 'Alex Morgan',
        cardNumber: '•••• •••• •••• 4444',
        cardType: 'Visa',
        expiryMonth: '12',
        expiryYear: '2028',
      },
    },
  ];

  constructor() {
    this.restoreFromStorage();
  }

  private restoreFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const storedUser = localStorage.getItem('storefront_user');
      if (storedUser) this.user = JSON.parse(storedUser);

      const storedAddrs = localStorage.getItem('storefront_addresses');
      if (storedAddrs) this.addresses = JSON.parse(storedAddrs);

      const storedCards = localStorage.getItem('storefront_cards');
      if (storedCards) this.paymentMethods = JSON.parse(storedCards);
    } catch (e) {
      console.warn('Could not restore user state from storage', e);
    }
  }

  private persistUser(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('storefront_user', JSON.stringify(this.user));
    } catch {}
  }

  private persistAddresses(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('storefront_addresses', JSON.stringify(this.addresses));
    } catch {}
  }

  private persistCards(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('storefront_cards', JSON.stringify(this.paymentMethods));
    } catch {}
  }

  async login(username: string, _password?: string): Promise<{ user: User; token: AuthToken }> {
    const isAlex = username.toLowerCase() === 'alex.morgan@example.com' || !username.includes('@');
    const user: User = isAlex
      ? this.user
      : {
          uid: username,
          name: username.split('@')[0],
          firstName: username.split('@')[0],
          lastName: 'Customer',
          displayUid: username,
          currency: { isocode: 'USD', symbol: '$' },
          language: { isocode: 'en', name: 'English' },
        };

    const token: AuthToken = {
      access_token: `mock_jwt_customer_${Date.now()}`,
      token_type: 'bearer',
      refresh_token: `mock_refresh_${Date.now()}`,
      expires_in: 7200,
      expires_at: Date.now() + 7200 * 1000,
      scope: 'basic openid',
    };

    this.user = user;
    this.persistUser();

    return { user, token };
  }

  async register(registration: UserRegistration): Promise<{ user: User; token: AuthToken }> {
    const user: User = {
      uid: registration.email.toLowerCase(),
      name: `${registration.firstName} ${registration.lastName}`.trim(),
      firstName: registration.firstName,
      lastName: registration.lastName,
      displayUid: registration.email.toLowerCase(),
      titleCode: registration.titleCode || 'mr',
      currency: { isocode: 'USD', symbol: '$' },
      language: { isocode: 'en', name: 'English' },
    };

    const token: AuthToken = {
      access_token: `mock_jwt_new_user_${Date.now()}`,
      token_type: 'bearer',
      refresh_token: `mock_refresh_new_${Date.now()}`,
      expires_in: 7200,
      expires_at: Date.now() + 7200 * 1000,
      scope: 'basic openid',
    };

    this.user = user;
    this.persistUser();

    return { user, token };
  }

  async getUser(userId: string): Promise<User | null> {
    if (this.user.uid === userId || this.user.displayUid === userId || userId === 'current') {
      return JSON.parse(JSON.stringify(this.user));
    }
    return JSON.parse(JSON.stringify(this.user));
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    this.user = {
      ...this.user,
      ...updates,
      name: updates.firstName && updates.lastName
        ? `${updates.firstName} ${updates.lastName}`
        : updates.name || this.user.name,
    };
    this.persistUser();
    return JSON.parse(JSON.stringify(this.user));
  }

  async changePassword(_userId: string, request: PasswordChangeRequest): Promise<void> {
    if (!request.oldPassword || !request.newPassword) {
      throw new Error('Both old and new passwords are required.');
    }
    if (request.newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }
    // Simulation success
  }

  async requestPasswordReset(email: string): Promise<void> {
    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    // Simulation success
  }

  // Address Book
  async getAddresses(_userId: string): Promise<Address[]> {
    return JSON.parse(JSON.stringify(this.addresses));
  }

  async addAddress(_userId: string, address: Address): Promise<Address> {
    const newAddress: Address = {
      ...address,
      id: `ADDR-${Date.now().toString(36).toUpperCase()}`,
      defaultAddress: this.addresses.length === 0 ? true : !!address.defaultAddress,
    };

    if (newAddress.defaultAddress) {
      this.addresses.forEach((a) => (a.defaultAddress = false));
      this.user.defaultAddressId = newAddress.id;
      this.persistUser();
    }

    this.addresses.push(newAddress);
    this.persistAddresses();
    return JSON.parse(JSON.stringify(newAddress));
  }

  async updateAddress(_userId: string, addressId: string, address: Address): Promise<Address> {
    const index = this.addresses.findIndex((a) => a.id === addressId);
    if (index === -1) throw new Error(`Address not found: ${addressId}`);

    const updated: Address = {
      ...this.addresses[index],
      ...address,
      id: addressId,
    };

    if (updated.defaultAddress) {
      this.addresses.forEach((a) => (a.defaultAddress = false));
      this.user.defaultAddressId = addressId;
      this.persistUser();
    }

    this.addresses[index] = updated;
    this.persistAddresses();
    return JSON.parse(JSON.stringify(updated));
  }

  async deleteAddress(_userId: string, addressId: string): Promise<void> {
    this.addresses = this.addresses.filter((a) => a.id !== addressId);
    if (this.user.defaultAddressId === addressId && this.addresses.length > 0) {
      this.addresses[0].defaultAddress = true;
      this.user.defaultAddressId = this.addresses[0].id;
      this.persistUser();
    }
    this.persistAddresses();
  }

  async setDefaultAddress(_userId: string, addressId: string): Promise<void> {
    this.addresses.forEach((a) => {
      a.defaultAddress = a.id === addressId;
    });
    this.user.defaultAddressId = addressId;
    this.persistUser();
    this.persistAddresses();
  }

  // Payment Details
  async getPaymentDetails(_userId: string): Promise<PaymentDetails[]> {
    return JSON.parse(JSON.stringify(this.paymentMethods));
  }

  async deletePaymentDetails(_userId: string, paymentDetailsId: string): Promise<void> {
    this.paymentMethods = this.paymentMethods.filter((p) => p.id !== paymentDetailsId);
    if (this.user.defaultPaymentInfoId === paymentDetailsId && this.paymentMethods.length > 0) {
      this.paymentMethods[0].defaultPayment = true;
      this.user.defaultPaymentInfoId = this.paymentMethods[0].id;
      this.persistUser();
    }
    this.persistCards();
  }

  // Order History
  async getOrderHistory(
    _userId: string,
    pageSize = 5,
    currentPage = 0,
    _sort?: string
  ): Promise<OrderHistoryList> {
    // Also include any dynamically placed orders from localStorage
    const dynamicOrders: Order[] = [];
    if (typeof window !== 'undefined') {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('order_ORDER-')) {
            const ord = JSON.parse(localStorage.getItem(key) || '{}');
            if (ord.code && !this.orders.some((o) => o.code === ord.code)) {
              dynamicOrders.push(ord);
            }
          }
        }
      } catch {}
    }

    const allOrders = [...dynamicOrders, ...this.orders];

    const items: OrderHistoryItem[] = allOrders.map((o) => ({
      code: o.code,
      guid: o.guid,
      placed: o.created,
      status: o.status || 'CONFIRMED',
      statusDisplay: o.status === 'DELIVERED' ? 'Delivered' : o.status === 'SHIPPED' ? 'Shipped' : 'Confirmed',
      total: o.totalPrice,
      totalItems: o.totalItems,
      deliveryAddressSummary: o.deliveryAddress ? `${o.deliveryAddress.line1}, ${o.deliveryAddress.city}` : undefined,
    }));

    const totalResults = items.length;
    const totalPages = Math.ceil(totalResults / pageSize) || 1;
    const startIndex = currentPage * pageSize;
    const pagedOrders = items.slice(startIndex, startIndex + pageSize);

    return {
      orders: pagedOrders,
      pagination: {
        currentPage,
        pageSize,
        totalPages,
        totalResults,
      },
    };
  }

  async getOrderDetails(_userId: string, orderCode: string): Promise<Order | null> {
    // Check in-memory list
    const found = this.orders.find((o) => o.code === orderCode);
    if (found) return JSON.parse(JSON.stringify(found));

    // Check localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`order_${orderCode}`);
        if (stored) return JSON.parse(stored);
      } catch {}
    }

    // Default fallback
    return JSON.parse(JSON.stringify(this.orders[0]));
  }
}
