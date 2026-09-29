'use client';

import React from 'react';
import { Address } from '@storefront/core';
import { Badge } from '../atoms/Badge';

export interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: (address: Address) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(address)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 relative ${
        isSelected
          ? 'border-blue-600 bg-blue-50/40 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-slate-900 text-sm">
          {address.firstName} {address.lastName}
        </span>
        {address.defaultAddress && (
          <Badge variant="info">Default</Badge>
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

      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
        <span className={`text-xs font-semibold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
          {isSelected ? '✓ Selected' : 'Select'}
        </span>
      </div>
    </div>
  );
};
