'use client';

import React from 'react';
import { Price } from '@storefront/core';
import { useSiteContext } from '../context/SiteContext';

export interface PriceTagProps {
  price?: Price;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  overrideCurrency?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  size = 'md',
  className = '',
  overrideCurrency,
}) => {
  if (!price) return null;

  let formatted = price.formattedValue;

  try {
    // Attempt dynamic conversion via SiteContext
    const context = useSiteContext();
    if (context?.formatPrice) {
      formatted = context.formatPrice(price, overrideCurrency);
    }
  } catch {
    // Outside SiteContextProvider fallback
    formatted = price.formattedValue;
  }

  const sizeStyles = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-black',
  };

  return (
    <span className={`text-slate-900 tracking-tight ${sizeStyles[size]} ${className}`}>
      {formatted}
    </span>
  );
};
