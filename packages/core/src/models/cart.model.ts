import { Price, Product } from './product.model';

export interface Address {
  id?: string;
  titleCode?: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  defaultAddress?: boolean;
}

export interface PaymentDetails {
  id?: string;
  accountHolderName: string;
  cardNumber: string;
  cardType: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  expiryMonth: string;
  expiryYear: string;
  cvv?: string;
  billingAddress?: Address;
  token?: string;
  defaultPayment?: boolean;
}

export interface DeliveryMode {
  code: string;
  name: string;
  description?: string;
  deliveryCost?: Price;
  estimatedDelivery?: string;
}

export interface Voucher {
  code: string;
  name?: string;
  description?: string;
  discountAmount?: Price;
  discountPercent?: number;
  applied: boolean;
}

export interface OrderEntry {
  entryNumber: number;
  quantity: number;
  product: Product;
  basePrice: Price;
  totalPrice: Price;
  updateable?: boolean;
}

export interface Cart {
  code: string;
  guid?: string;
  totalItems: number;
  totalPrice?: Price;
  subTotal?: Price;
  totalDiscounts?: Price;
  deliveryCost?: Price;
  totalTax?: Price;
  entries: OrderEntry[];
  deliveryAddress?: Address;
  deliveryMode?: DeliveryMode;
  paymentDetails?: PaymentDetails;
  appliedVouchers?: Voucher[];
}

export interface Order {
  code: string;
  guid?: string;
  created: string;
  status: 'CREATED' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'DELIVERED' | 'SHIPPED' | 'CANCELLED';
  totalItems: number;
  totalPrice: Price;
  subTotal: Price;
  totalDiscounts?: Price;
  deliveryCost?: Price;
  totalTax?: Price;
  entries: OrderEntry[];
  deliveryAddress: Address;
  deliveryMode: DeliveryMode;
  paymentDetails: PaymentDetails;
  appliedVouchers?: Voucher[];
}
