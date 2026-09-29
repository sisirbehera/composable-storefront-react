'use client';

import React from 'react';
import { DeliveryMode } from '@storefront/core';

export interface DeliveryModeSelectorProps {
  modes: DeliveryMode[];
  selectedModeCode?: string;
  onSelectMode: (modeCode: string) => void;
}

export const DeliveryModeSelector: React.FC<DeliveryModeSelectorProps> = ({
  modes,
  selectedModeCode,
  onSelectMode,
}) => {
  return (
    <div className="space-y-3">
      {modes.map((mode) => {
        const isSelected = selectedModeCode === mode.code;
        return (
          <div
            key={mode.code}
            onClick={() => onSelectMode(mode.code)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 flex items-center justify-between ${
              isSelected
                ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="deliveryMode"
                checked={isSelected}
                onChange={() => onSelectMode(mode.code)}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">{mode.name}</div>
                {mode.description && (
                  <div className="text-xs text-slate-500 mt-0.5">{mode.description}</div>
                )}
                {mode.estimatedDelivery && (
                  <div className="text-xs font-semibold text-emerald-600 mt-1">
                    ⏱ Estimated Delivery: {mode.estimatedDelivery}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-black text-slate-900">
                {mode.deliveryCost?.value === 0 ? 'FREE' : mode.deliveryCost?.formattedValue}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
