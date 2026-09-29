'use client';

import React, { useState } from 'react';
import { Address } from '@storefront/core';
import { Button } from '../atoms/Button';

export interface AddressFormProps {
  initialValues?: Partial<Address>;
  onSubmit: (address: Address) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Address>({
    firstName: initialValues?.firstName || '',
    lastName: initialValues?.lastName || '',
    line1: initialValues?.line1 || '',
    line2: initialValues?.line2 || '',
    city: initialValues?.city || '',
    postalCode: initialValues?.postalCode || '',
    country: initialValues?.country || 'United States',
    phone: initialValues?.phone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.line1.trim()) errs.line1 = 'Address line 1 is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal / ZIP code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        Delivery Address
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-rose-400 ring-rose-200' : 'border-slate-200'
            }`}
            placeholder="John"
          />
          {errors.firstName && <span className="text-[10px] text-rose-500 mt-0.5">{errors.firstName}</span>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-rose-400 ring-rose-200' : 'border-slate-200'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && <span className="text-[10px] text-rose-500 mt-0.5">{errors.lastName}</span>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address *</label>
        <input
          type="text"
          value={formData.line1}
          onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
          className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.line1 ? 'border-rose-400 ring-rose-200' : 'border-slate-200'
          }`}
          placeholder="123 Main St"
        />
        {errors.line1 && <span className="text-[10px] text-rose-500 mt-0.5">{errors.line1}</span>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Apt, Suite, Bldg (Optional)</label>
        <input
          type="text"
          value={formData.line2}
          onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Apt 4B"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.city ? 'border-rose-400 ring-rose-200' : 'border-slate-200'
            }`}
            placeholder="New York"
          />
          {errors.city && <span className="text-[10px] text-rose-500 mt-0.5">{errors.city}</span>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Postal / ZIP Code *</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.postalCode ? 'border-rose-400 ring-rose-200' : 'border-slate-200'
            }`}
            placeholder="10001"
          />
          {errors.postalCode && <span className="text-[10px] text-rose-500 mt-0.5">{errors.postalCode}</span>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Country *</label>
          <select
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Germany">Germany</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (Optional)</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
          Save & Use Address
        </Button>
      </div>
    </form>
  );
};
