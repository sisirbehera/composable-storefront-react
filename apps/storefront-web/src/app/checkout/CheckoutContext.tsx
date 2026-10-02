'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Address, Cart, DeliveryMode, PaymentDetails } from '@storefront/core';
import { getAdapterFactory } from '@storefront/api';
import { useSiteContext, useCartStore, resolveCartId } from '@storefront/ui';

export interface CheckoutContextType {
  cart: Cart | null;
  loading: boolean;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
  // Step 1: Address
  savedAddresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
  showNewAddressForm: boolean;
  setShowNewAddressForm: (show: boolean) => void;
  handleConfirmAddress: () => Promise<boolean>;
  handleAddNewAddress: (addr: Address) => Promise<boolean>;
  // Step 2: Delivery Mode
  deliveryModes: DeliveryMode[];
  selectedModeCode: string;
  setSelectedModeCode: (code: string) => void;
  handleConfirmDeliveryMode: () => Promise<boolean>;
  // Step 3: Payment
  paymentDetails: PaymentDetails | null;
  handleConfirmPayment: (payment: PaymentDetails) => Promise<boolean>;
  // Step 4: Submission
  isPlacingOrder: boolean;
  handlePlaceOrder: () => Promise<void>;
  getEffectiveCartId: () => string;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { activeSite } = useSiteContext();
  const { cart: storeCart, clearCart } = useCartStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1: Address State
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);

  // Step 2: Delivery Modes
  const [deliveryModes, setDeliveryModes] = useState<DeliveryMode[]>([]);
  const [selectedModeCode, setSelectedModeCode] = useState<string>('standard-gross');

  // Step 3: Payment
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  // Step 4: Place Order
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

  const getEffectiveCartId = useCallback((): string => {
    if (cart?.code) return cart.code;
    if (storeCart?.code && storeCart.entries && storeCart.entries.length > 0) return storeCart.code;
    return resolveCartId(activeSite.uid);
  }, [cart?.code, storeCart?.code, storeCart?.entries, activeSite.uid]);

  useEffect(() => {
    async function initCheckout() {
      try {
        const targetCartId = (storeCart && storeCart.entries && storeCart.entries.length > 0)
          ? storeCart.code
          : resolveCartId(activeSite.uid);

        const factory = getAdapterFactory();
        const currentCart = await factory.getCartAdapter().getCart(targetCartId);

        if (!currentCart || currentCart.entries.length === 0) {
          router.push('/cart');
          return;
        }
        setCart(currentCart);

        // Hydrate addresses
        const addresses = await factory.getCheckoutAdapter().getDeliveryAddresses();
        setSavedAddresses(addresses);
        if (currentCart.deliveryAddress) {
          setSelectedAddress(currentCart.deliveryAddress);
        } else if (addresses.length > 0) {
          const defaultAddr = addresses.find((a) => a.defaultAddress) || addresses[0];
          setSelectedAddress(defaultAddr);
        }

        // Hydrate delivery modes
        const modes = await factory.getCheckoutAdapter().getSupportedDeliveryModes(targetCartId);
        setDeliveryModes(modes);
        if (currentCart.deliveryMode?.code) {
          setSelectedModeCode(currentCart.deliveryMode.code);
        } else if (modes.length > 0) {
          setSelectedModeCode(modes[0].code);
        }

        // Hydrate payment details
        if (currentCart.paymentDetails) {
          setPaymentDetails(currentCart.paymentDetails);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to initialize checkout.');
      } finally {
        setLoading(false);
      }
    }

    initCheckout();
  }, [router, activeSite.uid, storeCart?.code]);

  // Handler: Confirm Address (Step 1)
  const handleConfirmAddress = async (): Promise<boolean> => {
    if (!selectedAddress) {
      setErrorMsg('Please select or add a delivery address.');
      return false;
    }
    setErrorMsg(null);
    try {
      const targetCartId = getEffectiveCartId();
      const factory = getAdapterFactory();
      const updatedCart = await factory.getCheckoutAdapter().setDeliveryAddress(targetCartId, selectedAddress);
      setCart(updatedCart);
      return true;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to set delivery address.');
      return false;
    }
  };

  // Handler: Add New Address (Step 1)
  const handleAddNewAddress = async (newAddress: Address): Promise<boolean> => {
    setErrorMsg(null);
    try {
      const targetCartId = getEffectiveCartId();
      const factory = getAdapterFactory();
      const updatedCart = await factory.getCheckoutAdapter().setDeliveryAddress(targetCartId, newAddress);
      setCart(updatedCart);
      setSelectedAddress(newAddress);
      setShowNewAddressForm(false);
      setSavedAddresses((prev) => [...prev, newAddress]);
      return true;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add delivery address.');
      return false;
    }
  };

  // Handler: Confirm Delivery Mode (Step 2)
  const handleConfirmDeliveryMode = async (): Promise<boolean> => {
    setErrorMsg(null);
    try {
      const targetCartId = getEffectiveCartId();
      const factory = getAdapterFactory();
      const updatedCart = await factory.getCheckoutAdapter().setDeliveryMode(targetCartId, selectedModeCode);
      setCart(updatedCart);
      return true;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to set delivery mode.');
      return false;
    }
  };

  // Handler: Confirm Payment (Step 3)
  const handleConfirmPayment = async (payment: PaymentDetails): Promise<boolean> => {
    setErrorMsg(null);
    try {
      const targetCartId = getEffectiveCartId();
      const factory = getAdapterFactory();
      const updatedCart = await factory.getCheckoutAdapter().setPaymentDetails(targetCartId, payment);
      setCart(updatedCart);
      setPaymentDetails(updatedCart.paymentDetails || payment);
      return true;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save payment details.');
      return false;
    }
  };

  // Handler: Place Order (Step 4)
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setErrorMsg(null);
    try {
      const targetCartId = getEffectiveCartId();
      const factory = getAdapterFactory();
      const order = await factory.getCheckoutAdapter().placeOrder(targetCartId);
      await clearCart();
      router.push(`/order-confirmation/${order.code}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        cart,
        loading,
        errorMsg,
        setErrorMsg,
        savedAddresses,
        selectedAddress,
        setSelectedAddress,
        showNewAddressForm,
        setShowNewAddressForm,
        handleConfirmAddress,
        handleAddNewAddress,
        deliveryModes,
        selectedModeCode,
        setSelectedModeCode,
        handleConfirmDeliveryMode,
        paymentDetails,
        handleConfirmPayment,
        isPlacingOrder,
        handlePlaceOrder,
        getEffectiveCartId,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
