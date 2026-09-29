'use client';

import React from 'react';
import { FlexComponentProperties } from '@storefront/core';

export interface FlexComponentProps {
  properties: FlexComponentProperties;
  uid?: string;
  name?: string;
}

// Sub-registry of flex renderers mapped by flexType
const flexRenderers: Record<string, React.FC<any>> = {
  BreadcrumbComponent: () => (
    <nav className="flex items-center space-x-2 text-xs text-slate-500 py-2">
      <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
      <span>/</span>
      <span className="font-semibold text-slate-800">Catalogue</span>
    </nav>
  ),
  MiniCartComponent: () => (
    <a
      href="/cart"
      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
    >
      <span>🛒</span>
      <span>Quick Cart</span>
    </a>
  ),
  SearchBoxComponent: () => (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Quick search products..."
        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ),
  LoginComponent: () => (
    <a
      href="/login"
      className="text-xs font-medium text-slate-700 hover:text-blue-600 transition-colors"
    >
      Sign In
    </a>
  ),
};

export const FlexComponent: React.FC<FlexComponentProps> = ({
  properties,
  uid,
  name,
}) => {
  const { flexType, ...customProps } = properties || {};
  const Renderer = flexRenderers[flexType];

  if (Renderer) {
    return <Renderer {...customProps} uid={uid} name={name} />;
  }

  // Fallback for custom or unmapped flex types
  return (
    <div className="p-3 my-2 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
          FLEX: {flexType || 'Default'}
        </span>
        <span className="text-slate-600">{name || uid}</span>
      </div>
      <span className="text-[10px] text-slate-400 font-mono">CMSFlexComponent</span>
    </div>
  );
};

export function registerFlexComponent(flexType: string, renderer: React.FC<any>): void {
  flexRenderers[flexType] = renderer;
}
