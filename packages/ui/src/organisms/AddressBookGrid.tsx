'use client';

import React, { useState } from 'react';
import { Address } from '@storefront/core';
import { AddressForm } from '../molecules/AddressForm';

export interface AddressBookGridProps {
  addresses: Address[];
  isLoading?: boolean;
  onAddAddress: (address: Address) => Promise<void>;
  onUpdateAddress: (addressId: string, address: Address) => Promise<void>;
  onDeleteAddress: (addressId: string) => Promise<void>;
  onSetDefaultAddress: (addressId: string) => Promise<void>;
}

export const AddressBookGrid: React.FC<AddressBookGridProps> = ({
  addresses,
  isLoading = false,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleSaveAddress = async (address: Address) => {
    setActionLoading(true);
    try {
      if (editingAddress && editingAddress.id) {
        await onUpdateAddress(editingAddress.id, address);
        setEditingAddress(null);
      } else {
        await onAddAddress(address);
        setShowAddForm(false);
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Address Book</h2>
          <p className="text-xs text-slate-500">Manage your shipping and billing addresses</p>
        </div>
        {!showAddForm && !editingAddress && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {/* Address Form (Add or Edit) */}
      {(showAddForm || editingAddress) && (
        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-blue-100 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingAddress(null);
              }}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
          <AddressForm
            initialValues={editingAddress || undefined}
            onSubmit={handleSaveAddress}
            onCancel={() => {
              setShowAddForm(false);
              setEditingAddress(null);
            }}
            isLoading={actionLoading}
          />
        </div>
      )}

      {/* Address Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
          <div className="h-44 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
        </div>
      ) : addresses.length === 0 && !showAddForm ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Addresses Saved</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Add a shipping address to speed up checkout and order fulfillment.
          </p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
          >
            Add Address Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id || `${address.line1}-${address.postalCode}`}
              className={`bg-white rounded-2xl border p-5 shadow-sm relative flex flex-col justify-between transition-all ${
                address.defaultAddress ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-900 text-sm">
                    {address.firstName} {address.lastName}
                  </span>
                  {address.defaultAddress && (
                    <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                      Default Address
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-0.5 leading-relaxed">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.city}, {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && (
                    <p className="text-slate-400 mt-2 font-mono">{address.phone}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {!address.defaultAddress && address.id && (
                    <button
                      type="button"
                      onClick={() => onSetDefaultAddress(address.id!)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEditingAddress(address)}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  {address.id && (
                    <button
                      type="button"
                      onClick={() => onDeleteAddress(address.id!)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
