'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Address, Cart, DeliveryMode, PaymentDetails } from '@storefront/core';
import { getAdapterFactory } from '@storefront/api';
import {
  CheckoutStepper,
  AddressCard,
  AddressForm,
  DeliveryModeSelector,
  PaymentForm,
  CheckoutReview,
  Button,
  useSiteContext,
  useCartStore,
  resolveCartId,
} from '@storefront/ui';

export const CheckoutClient: React.FC = () => {
  const router = useRouter();
  const { activeSite } = useSiteContext();
  const { cart: storeCart, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<Cart | null>(null);

  const getEffectiveCartId = (): string => {
    if (cart?.code) return cart.code;
    if (storeCart?.code && storeCart.entries && storeCart.entries.length > 0) return storeCart.code;
    return resolveCartId(activeSite.uid);
  };

  // Step 1: Addresses
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);

  // Step 2: Delivery Modes
  const [deliveryModes, setDeliveryModes] = useState<DeliveryMode[]>([]);
  const [selectedModeCode, setSelectedModeCode] = useState<string>('standard-gross');

  // Step 3: Payment
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  // Step 4: Submission
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

        const addresses = await factory.getCheckoutAdapter().getDeliveryAddresses();
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          const defaultAddr = addresses.find((a) => a.defaultAddress) || addresses[0];
          setSelectedAddress(defaultAddr);
        }

        const modes = await factory.getCheckoutAdapter().getSupportedDeliveryModes(targetCartId);
        setDeliveryModes(modes);
        if (modes.length > 0) {
          setSelectedModeCode(modes[0].code);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to initialize checkout.');
      } finally {
        setLoading(false);
      }
    }

    initCheckout();
  }, [router, activeSite.uid, storeCart?.code]);

  // Step 1 Handler: Confirm Address & Continue
  const handleConfirmAddress = async () => {
    if (!selectedAddress) {
      setErrorMsg('Please select or add a delivery address.');
      return;
    }
    setErrorMsg(null);
    try {
      const targetCartId = getEffectiveCartId();
      const factory = getAdapterFactory();
      const updatedCart = await factory.getCheckoutAdapter().setDeliveryAddress(targetCartId, selectedAddress);
      setCart(updatedCart);
      setCurrentStep(2);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleAddNewAddress = async (newAddress: Address) => {
    try {
      const targetCartId = getEffectiveCartId();
      const factory = getAdapterFactory();
      const updatedCart = await factory.getCheckoutAdapter().setDeliveryAddress(targetCartId, newAddress);
      setCart(updatedCart);
      setSelectedAddress(newAddress);
      setShowNewAddressForm(false);
      setSavedAddresses((prev) => [...prev, newAddress]);
      setCurrentStep(2);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Step 2 Handler: Confirm Delivery Mode & Continue
  const handleConfirmDeliveryMode = async () => {
    try {
      const targetCartId = getEffectiveCartId();
      const factory = getAdapterFactory();
      const updatedCart = await factory.getCheckoutAdapter().setDeliveryMode(targetCartId, selectedModeCode);
      setCart(updatedCart);
      setCurrentStep(3);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Step 3 Handler: Confirm Payment Details & Continue
  const handleConfirmPayment = async (payment: PaymentDetails) => {
    try {
      const targetCartId = getEffectiveCartId();
      const factory = getAdapterFactory();
      const updatedCart = await factory.getCheckoutAdapter().setPaymentDetails(targetCartId, payment);
      setCart(updatedCart);
      setPaymentDetails(updatedCart.paymentDetails || payment);
      setCurrentStep(4);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Step 4 Handler: Place Order
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Initializing checkout...
      </div>
    );
  }

  if (!cart || cart.entries.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete your purchase in 4 easy steps.
        </p>
      </div>

      <CheckoutStepper
        currentStep={currentStep}
        onStepClick={(stepId) => setCurrentStep(stepId)}
      />

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          ✕ {errorMsg}
        </div>
      )}

      {/* STEP 1: SHIPPING ADDRESS */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">1. Select Shipping Address</h2>
            <button
              type="button"
              onClick={() => setShowNewAddressForm(!showNewAddressForm)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              {showNewAddressForm ? '← Back to Saved Addresses' : '+ Add New Address'}
            </button>
          </div>

          {showNewAddressForm ? (
            <AddressForm
              onSubmit={handleAddNewAddress}
              onCancel={() => setShowNewAddressForm(false)}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <AddressCard
                    key={addr.id || addr.line1}
                    address={addr}
                    isSelected={selectedAddress?.id === addr.id}
                    onSelect={(a) => setSelectedAddress(a)}
                  />
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button
                  size="md"
                  variant="primary"
                  onClick={handleConfirmAddress}
                  disabled={!selectedAddress}
                >
                  Continue to Delivery Mode &rarr;
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: DELIVERY MODE */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">2. Choose Delivery Method</h2>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              ← Edit Address
            </button>
          </div>

          <DeliveryModeSelector
            modes={deliveryModes}
            selectedModeCode={selectedModeCode}
            onSelectMode={(code) => setSelectedModeCode(code)}
          />

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentStep(1)}
            >
              &larr; Back
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={handleConfirmDeliveryMode}
            >
              Continue to Payment &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">3. Payment Details</h2>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              ← Edit Delivery
            </button>
          </div>

          <PaymentForm onSubmit={handleConfirmPayment} />
        </div>
      )}

      {/* STEP 4: REVIEW & PLACE ORDER */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              4. Review Your Order
            </h2>
            <span className="text-xs text-slate-400">
              Please review all information before clicking Place Order.
            </span>
          </div>

          <CheckoutReview
            deliveryAddress={cart.deliveryAddress || selectedAddress || undefined}
            deliveryMode={cart.deliveryMode}
            paymentDetails={cart.paymentDetails || paymentDetails || undefined}
            entries={cart.entries}
            subTotal={cart.subTotal}
            totalDiscounts={cart.totalDiscounts}
            deliveryCost={cart.deliveryCost}
            totalTax={cart.totalTax}
            totalPrice={cart.totalPrice}
            onEditStep={(stepId) => setCurrentStep(stepId)}
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
          />
        </div>
      )}
    </div>
  );
};
