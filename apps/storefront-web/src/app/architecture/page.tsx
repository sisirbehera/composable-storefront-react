import React from 'react';
import { appConfig } from '@/config/storefront.config';
import { Badge } from '@storefront/ui';
import { ArchitectureClient } from './ArchitectureClient';

export default function ArchitecturePage() {
  const isMock = appConfig.commerce.useMockData;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge variant="info" className="mb-3">
          Architecture Blueprint
        </Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Composable Storefront Architecture
        </h1>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
          Modern React & Next.js equivalent to SAP Composable Storefront (Spartacus).
        </p>
      </div>

      {/* Current Runtime Status */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-10 shadow-lg border border-slate-800">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Current Data Source Runtime
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold text-emerald-400 flex items-center space-x-2">
              <span>{isMock ? 'Mock Data Module (Local Fixtures)' : 'Live OCC API (SAP Commerce)'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isMock
                ? 'Consuming local CMS and Product fixtures with simulated async delay.'
                : `Targeting live OCC endpoint: ${appConfig.commerce.occ.baseUrl}${appConfig.commerce.occ.prefix}${appConfig.commerce.occ.baseSite}`}
            </p>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 font-mono text-xs text-amber-300">
            NEXT_PUBLIC_USE_MOCK_DATA={String(isMock)}
          </div>
        </div>
      </div>

      {/* Interactive CMS Matrix and Spartacus Outlet Lab (Option C) */}
      <div className="mb-12">
        <ArchitectureClient initialConfig={appConfig} />
      </div>

      {/* Architecture Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="text-blue-600 font-mono font-bold text-sm mb-1">@storefront/core</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Clean Domain Models & Config</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Centralizes product, cart, user, and CMS models. Strictly decoupled from Hybris backend DTOs so UI components never bind directly to OCC schemas.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="text-blue-600 font-mono font-bold text-sm mb-1">@storefront/api</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Pluggable Adapters & Normalizers</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Implements the Adapter pattern with an <code>AdapterFactory</code>. Seamlessly toggles between <code>MockProductAdapter</code> / <code>MockCmsAdapter</code> and <code>OccProductAdapter</code> / <code>OccCmsAdapter</code>.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="text-blue-600 font-mono font-bold text-sm mb-1">@storefront/cms</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Dynamic Slot Engine & SmartEdit</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Maps OCC CMS Page Templates (<code>LandingPage2Template</code>) to <code>CmsSlot</code> and resolves component type codes dynamically. Adds SmartEdit HTML contracts for in-context authoring.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="text-blue-600 font-mono font-bold text-sm mb-1">@storefront/ui</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Composable UI Design System</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Accessible, reusable UI atoms (Button, Badge, PriceTag), molecules (ProductCard, Search), and organisms (Header, Footer).
          </p>
        </div>
      </div>
    </div>
  );
}
