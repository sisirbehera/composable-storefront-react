export interface AuthToken {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
  expires_at?: number;
}

export interface User {
  uid: string;
  name: string;
  firstName?: string;
  lastName?: string;
  displayUid?: string;
  titleCode?: string;
  defaultAddressId?: string;
  defaultPaymentInfoId?: string;
  currency?: {
    isocode: string;
    symbol: string;
  };
  language?: {
    isocode: string;
    name: string;
  };
}

export interface UserRegistration {
  titleCode?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

export interface OrderHistoryItem {
  code: string;
  guid?: string;
  placed: string;
  status: string;
  statusDisplay: string;
  total: {
    currencyIso: string;
    value: number;
    formattedValue: string;
  };
  totalItems: number;
  deliveryAddressSummary?: string;
}

export interface OrderHistoryList {
  orders: OrderHistoryItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalResults: number;
    sort?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  isGuest: boolean;
  user?: User;
  token?: AuthToken;
}

