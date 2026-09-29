'use client';

import React from 'react';
import { OutletContextProps } from '@storefront/core';

/**
 * Sample Outlet Component 1:
 * Injected at ProductDetails.Actions (BEFORE)
 */
export const VipRewardsTeaser: React.FC<OutletContextProps> = ({ context }) => {
  const product = context?.product;
  const points = product?.price?.value ? Math.floor(product.price.value) : 100;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 my-3 flex items-center space-x-3 text-amber-900 shadow-sm animate-fade-in">
      <span className="text-xl">⭐</span>
      <div className="text-xs">
        <span className="font-bold text-amber-800">VIP Rewards Member Exclusive:</span>
        <div className="text-amber-700">
          Earn <span className="font-bold underline">{points * 2} Points</span> on this purchase + Free Next-Day Air Shipping.
        </div>
      </div>
    </div>
  );
};

/**
 * Sample Outlet Component 2:
 * Injected at ProductDetails.Actions (AFTER)
 */
export const BuyerTrustBadge: React.FC<OutletContextProps> = () => {
  return (
    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600 animate-fade-in">
      <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
        Guaranteed Buyer Protection
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center space-x-1.5 text-emerald-700">
          <span>✓</span>
          <span>30-Day Free Returns</span>
        </div>
        <div className="flex items-center space-x-1.5 text-blue-700">
          <span>🛡</span>
          <span>2-Year Full Warranty</span>
        </div>
        <div className="flex items-center space-x-1.5 text-purple-700">
          <span>⚡</span>
          <span>Same-Day Dispatch</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-700">
          <span>🔒</span>
          <span>PCI-DSS Tokenized</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Sample Outlet Component 3:
 * Injected at Cart.Summary (AFTER)
 */
export const EcoShippingBadge: React.FC<OutletContextProps> = () => {
  return (
    <div className="pt-3 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-emerald-700 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200 animate-fade-in">
      <span className="text-base">🌱</span>
      <div>
        <span className="font-bold">100% Carbon-Neutral Shipping</span>
        <div className="text-[10px] text-emerald-600">
          Every shipment verified offset through certified renewable investments.
        </div>
      </div>
    </div>
  );
};

/**
 * Sample Outlet Component 4:
 * Injected at CmsComponent.SimpleResponsiveBannerComponent (BEFORE)
 */
export const FlashSaleTicker: React.FC<OutletContextProps> = () => {
  return (
    <div className="bg-gradient-to-r from-rose-600 to-orange-500 text-white text-xs font-bold py-2 px-4 rounded-lg mb-4 flex items-center justify-between shadow animate-pulse">
      <div className="flex items-center space-x-2">
        <span className="bg-white text-rose-600 text-[10px] font-black uppercase px-2 py-0.5 rounded">
          Limited Time
        </span>
        <span>Flash Deal: Apply promo code <span className="font-mono underline">SAVE20</span> for 20% off sitewide!</span>
      </div>
      <span className="text-[11px] font-mono tracking-widest hidden sm:inline">ENDS TODAY</span>
    </div>
  );
};
