import {
  Address,
  AuthToken,
  Order,
  OrderHistoryList,
  PasswordChangeRequest,
  PaymentDetails,
  User,
  UserRegistration,
} from '@storefront/core';

export interface UserAdapter {
  login(username: string, password?: string): Promise<{ user: User; token: AuthToken }>;
  register(registration: UserRegistration): Promise<{ user: User; token: AuthToken }>;
  getUser(userId: string): Promise<User | null>;
  updateUser(userId: string, user: Partial<User>): Promise<User>;
  changePassword(userId: string, request: PasswordChangeRequest): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;

  // Address Book
  getAddresses(userId: string): Promise<Address[]>;
  addAddress(userId: string, address: Address): Promise<Address>;
  updateAddress(userId: string, addressId: string, address: Address): Promise<Address>;
  deleteAddress(userId: string, addressId: string): Promise<void>;
  setDefaultAddress(userId: string, addressId: string): Promise<void>;

  // Saved Payment Methods
  getPaymentDetails(userId: string): Promise<PaymentDetails[]>;
  deletePaymentDetails(userId: string, paymentDetailsId: string): Promise<void>;

  // Order History & Details
  getOrderHistory(
    userId: string,
    pageSize?: number,
    currentPage?: number,
    sort?: string
  ): Promise<OrderHistoryList>;
  getOrderDetails(userId: string, orderCode: string): Promise<Order | null>;
}
