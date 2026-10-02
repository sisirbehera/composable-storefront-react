'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AddressCard, AddressForm, Button } from '@storefront/ui';
import { useCheckout } from '../CheckoutContext';

export default function ShippingAddressStepPage() {
  const router = useRouter();
  const {
    savedAddresses,
    selectedAddress,
    setSelectedAddress,
    showNewAddressForm,
    setShowNewAddressForm,
    handleConfirmAddress,
    handleAddNewAddress,
  } = useCheckout();

  const onContinue = async () => {
    const success = await handleConfirmAddress();
    if (success) {
      router.push('/checkout/delivery-mode');
    }
  };

  const onAddAddressSubmit = async (newAddress: any) => {
    const success = await handleAddNewAddress(newAddress);
    if (success) {
      router.push('/checkout/delivery-mode');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          1. Select Shipping Address
        </h2>
        <button
          type="button"
          onClick={() => setShowNewAddressForm(!showNewAddressForm)}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
        >
          {showNewAddressForm ? '← Back to Saved Addresses' : '+ Add New Address'}
        </button>
      </div>

      {showNewAddressForm ? (
        <AddressForm
          onSubmit={onAddAddressSubmit}
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

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              size="md"
              variant="primary"
              onClick={onContinue}
              disabled={!selectedAddress}
            >
              Continue to Delivery Mode &rarr;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
