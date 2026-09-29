'use client';

import React from 'react';

export interface CheckoutStep {
  id: number;
  name: string;
  description?: string;
}

export interface CheckoutStepperProps {
  currentStep: number;
  steps?: CheckoutStep[];
  onStepClick?: (stepId: number) => void;
}

const defaultSteps: CheckoutStep[] = [
  { id: 1, name: 'Shipping Address' },
  { id: 2, name: 'Delivery Mode' },
  { id: 3, name: 'Payment' },
  { id: 4, name: 'Review & Place Order' },
];

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  currentStep,
  steps = defaultSteps,
  onStepClick,
}) => {
  return (
    <nav aria-label="Checkout Progress" className="mb-8">
      <ol className="flex items-center justify-between w-full max-w-3xl mx-auto">
        {steps.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted && onStepClick;

          return (
            <li
              key={step.id}
              className={`flex-1 relative flex flex-col items-center ${
                idx < steps.length - 1
                  ? "after:content-[''] after:w-full after:h-0.5 after:bg-slate-200 after:absolute after:top-4 after:left-1/2 after:z-0"
                  : ''
              } ${
                isCompleted
                  ? "after:bg-blue-600"
                  : ''
              }`}
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? '✓' : step.id}
              </button>

              <span
                className={`mt-2 text-xs text-center font-medium ${
                  isCurrent
                    ? 'text-blue-600 font-bold'
                    : isCompleted
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {step.name}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
