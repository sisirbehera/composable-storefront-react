'use client';

import React, { useState } from 'react';
import { Button, useSiteContext, useCartStore } from '@storefront/ui';

export interface AddToCartButtonProps {
  productCode: string;
  disabled?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productCode,
  disabled = false,
}) => {
  const { activeSite } = useSiteContext();
  const { addToCart, isLoading: storeLoading } = useCartStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      await addToCart(productCode, quantity, activeSite.uid, true);
      setMessage(`Added ${quantity} item(s) to cart successfully!`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage('Failed to add to cart.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
          <button
            type="button"
            className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || disabled}
          >
            -
          </button>
          <span className="px-4 py-2 text-sm font-semibold text-slate-800">
            {quantity}
          </span>
          <button
            type="button"
            className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700"
            onClick={() => setQuantity(quantity + 1)}
            disabled={disabled}
          >
            +
          </button>
        </div>

        <Button
          size="lg"
          variant="primary"
          className="flex-1"
          disabled={disabled}
          isLoading={isLoading}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>

      {message && (
        <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
};
