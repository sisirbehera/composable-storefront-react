'use client';

import React, { useState } from 'react';
import { Voucher } from '@storefront/core';
import { Button } from '../atoms/Button';

export interface CouponInputProps {
  appliedVouchers?: Voucher[];
  onApplyCoupon: (code: string) => Promise<void>;
  onRemoveCoupon: (code: string) => Promise<void>;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  appliedVouchers = [],
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await onApplyCoupon(couponCode.trim());
      setSuccessMsg(`Coupon "${couponCode.toUpperCase()}" applied!`);
      setCouponCode('');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to apply coupon.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (code: string) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await onRemoveCoupon(code);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove coupon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 pt-4 border-t border-slate-200">
      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        Promo Code / Voucher
      </div>

      <form onSubmit={handleApply} className="flex space-x-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="e.g. SAVE20 or FREESHIP"
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono uppercase tracking-wider outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={!couponCode.trim()}
          isLoading={loading}
        >
          Apply
        </Button>
      </form>

      {/* Suggested demo vouchers hint */}
      <div className="text-[11px] text-slate-400">
        Demo coupons: <span className="font-mono text-blue-600 font-bold">SAVE20</span> (20% off), <span className="font-mono text-blue-600 font-bold">FREESHIP</span> (Free Express), <span className="font-mono text-blue-600 font-bold">DISCOUNT10</span> ($10 off)
      </div>

      {successMsg && (
        <div className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-medium">
          ✓ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200 font-medium">
          ✕ {errorMsg}
        </div>
      )}

      {/* Applied vouchers list */}
      {appliedVouchers.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {appliedVouchers.map((voucher) => (
            <div
              key={voucher.code}
              className="flex items-center justify-between p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs"
            >
              <div className="flex items-center space-x-1.5">
                <span className="font-mono font-bold text-emerald-800">{voucher.code}</span>
                {voucher.name && (
                  <span className="text-emerald-700 font-medium">({voucher.name})</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(voucher.code)}
                className="text-emerald-700 hover:text-rose-600 font-bold text-xs ml-2 cursor-pointer transition-colors"
                aria-label={`Remove ${voucher.code}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
