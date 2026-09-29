'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@storefront/auth';
import { getAdapterFactory } from '@storefront/api';
import { appConfig } from '@/config/storefront.config';
import { Address } from '@storefront/core';
import { AddressBookGrid } from '@storefront/ui';

export default function AddressBookPage() {
  const { authState } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAddresses = useCallback(async () => {
    if (!authState.user?.uid) return;
    setLoading(true);
    try {
      const factory = getAdapterFactory(appConfig);
      const userAdapter = factory.getUserAdapter();
      const list = await userAdapter.getAddresses(authState.user.uid);
      setAddresses(list);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  }, [authState.user?.uid]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleAddAddress = async (newAddr: Address) => {
    if (!authState.user?.uid) return;
    const factory = getAdapterFactory(appConfig);
    await factory.getUserAdapter().addAddress(authState.user.uid, newAddr);
    await loadAddresses();
  };

  const handleUpdateAddress = async (addressId: string, updatedAddr: Address) => {
    if (!authState.user?.uid) return;
    const factory = getAdapterFactory(appConfig);
    await factory.getUserAdapter().updateAddress(authState.user.uid, addressId, updatedAddr);
    await loadAddresses();
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!authState.user?.uid) return;
    const factory = getAdapterFactory(appConfig);
    await factory.getUserAdapter().deleteAddress(authState.user.uid, addressId);
    await loadAddresses();
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!authState.user?.uid) return;
    const factory = getAdapterFactory(appConfig);
    await factory.getUserAdapter().setDefaultAddress(authState.user.uid, addressId);
    await loadAddresses();
  };

  return (
    <div className="space-y-6">
      <AddressBookGrid
        addresses={addresses}
        isLoading={loading}
        onAddAddress={handleAddAddress}
        onUpdateAddress={handleUpdateAddress}
        onDeleteAddress={handleDeleteAddress}
        onSetDefaultAddress={handleSetDefaultAddress}
      />
    </div>
  );
}
