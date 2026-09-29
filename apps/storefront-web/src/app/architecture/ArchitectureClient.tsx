'use client';

import React, { useState } from 'react';
import { OutletPosition, StorefrontConfig } from '@storefront/core';
import { useOutletRegistry, useSmartEdit } from '@storefront/cms';
import { Button, Badge } from '@storefront/ui';
import {
  VipRewardsTeaser,
  BuyerTrustBadge,
  EcoShippingBadge,
  FlashSaleTicker,
} from '@/components/outlets/SampleOutlets';

interface ArchitectureClientProps {
  initialConfig: StorefrontConfig;
}

export const ArchitectureClient: React.FC<ArchitectureClientProps> = ({
  initialConfig,
}) => {
  const { register, isHighlightEnabled, setHighlightEnabled } = useOutletRegistry();
  const {
    perspective,
    setPerspective,
    isAuthoringMode,
    catalogVersion,
    setToolbarVisible,
  } = useSmartEdit();

  // Active custom outlets state
  const [activeOutlets, setActiveOutlets] = useState<Record<string, boolean>>({
    vipRewards: false,
    buyerTrust: false,
    ecoShipping: false,
    flashSale: false,
  });

  // State for outlet unregister cleanup callbacks
  const [unregisters, setUnregisters] = useState<Record<string, (() => void) | null>>({});

  // CMS Provider choice
  const [selectedCms, setSelectedCms] = useState<'hybris' | 'contentful'>(
    initialConfig.cms.provider === 'contentful' ? 'contentful' : 'hybris'
  );

  const toggleOutlet = (key: string) => {
    setActiveOutlets((prev) => {
      const isCurrentlyActive = prev[key];
      const nextState = !isCurrentlyActive;

      if (nextState) {
        // Register the outlet
        let cleanup: (() => void) | null = null;
        if (key === 'vipRewards') {
          cleanup = register(
            'ProductDetails.Actions',
            VipRewardsTeaser,
            OutletPosition.BEFORE,
            10
          );
        } else if (key === 'buyerTrust') {
          cleanup = register(
            'ProductDetails.Actions',
            BuyerTrustBadge,
            OutletPosition.AFTER,
            5
          );
        } else if (key === 'ecoShipping') {
          cleanup = register(
            'Cart.Summary',
            EcoShippingBadge,
            OutletPosition.AFTER,
            10
          );
        } else if (key === 'flashSale') {
          cleanup = register(
            'CmsComponent.SimpleResponsiveBannerComponent',
            FlashSaleTicker,
            OutletPosition.BEFORE,
            20
          );
        }

        setUnregisters((u) => ({ ...u, [key]: cleanup }));
      } else {
        // Unregister
        if (unregisters[key]) {
          unregisters[key]!();
          setUnregisters((u) => ({ ...u, [key]: null }));
        }
      }

      return { ...prev, [key]: nextState };
    });
  };

  return (
    <div className="space-y-10">
      {/* 1. CMS Provider Comparison & Switcher (Option C) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="info">CMS Abstraction Layer</Badge>
              <span className="text-xs font-mono text-slate-400">Pluggable Connectors</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              Decoupled Headless CMS Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Switch between SAP Commerce Cloud (OCC CMS) and Contentful Headless CMS without touching presentation components.
            </p>
          </div>

          {/* CMS Provider Switcher Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setSelectedCms('hybris')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedCms === 'hybris'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SAP Commerce OCC CMS
            </button>
            <button
              onClick={() => setSelectedCms('contentful')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedCms === 'contentful'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contentful Headless CMS
            </button>
          </div>
        </div>

        {/* CMS Details Card */}
        {selectedCms === 'contentful' ? (
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 text-xs text-slate-700 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                <span className="font-bold text-blue-950 text-sm">
                  Active Connector: Contentful Delivery API (CDA)
                </span>
              </div>
              <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                Adapter: ContentfulCmsAdapter
              </span>
            </div>
            <p className="leading-relaxed">
              Streams JSON entry graphs from Contentful CDA (<code>https://cdn.contentful.com/spaces/...</code>) or local high-fidelity Contentful fixtures. <code>ContentfulNormalizer</code> transforms Contentful Content Types (<code>landingPage</code>, <code>heroBanner</code>, <code>productCarousel</code>, <code>richTextSection</code>) into Spartacus-compliant <code>CmsSlot</code> and <code>CmsComponent</code> trees.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-mono">
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <div className="text-slate-400">Content Model:</div>
                <div className="font-bold text-slate-800 mt-0.5">landingPage &rarr; slots</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <div className="text-slate-400">Delivery Method:</div>
                <div className="font-bold text-slate-800 mt-0.5">CDA REST / GraphQL</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <div className="text-slate-400">UI Mapping:</div>
                <div className="font-bold text-slate-800 mt-0.5">Auto-normalizing</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-700 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-900 text-sm">
                  Active Connector: SAP Commerce Cloud (Hybris OCC CMS)
                </span>
              </div>
              <span className="font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                Adapter: {initialConfig.commerce.useMockData ? 'MockCmsAdapter' : 'OccCmsAdapter'}
              </span>
            </div>
            <p className="leading-relaxed">
              Consumes standard SAP Commerce OCC CMS endpoints (<code>/occ/v2/electronics-spa/cms/pages</code>). Automatically structures layout slots for <code>LandingPage2Template</code> and supports SmartEdit in-context live authoring.
            </p>
          </div>
        )}
      </div>

      {/* 2. Spartacus <Outlet> Customization Lab */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="success">Spartacus Extensibility</Badge>
              <span className="text-xs font-mono text-purple-600 font-bold">&lt;Outlet&gt; System</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              Dynamic Outlet Extension Playground
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Just like SAP Spartacus <code>&lt;cx-outlet&gt;</code>, inject custom templates into predefined slots with <code>BEFORE</code>, <code>REPLACE</code>, or <code>AFTER</code> without modifying core template files.
            </p>
          </div>

          {/* Highlight Debug Mode Toggle */}
          <div className="flex items-center space-x-2 bg-purple-50 border border-purple-200 px-3 py-2 rounded-xl">
            <input
              type="checkbox"
              id="highlight-toggle"
              checked={isHighlightEnabled}
              onChange={(e) => setHighlightEnabled(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded cursor-pointer"
            />
            <label
              htmlFor="highlight-toggle"
              className="text-xs font-bold text-purple-900 cursor-pointer select-none"
            >
              Highlight Outlets (Debug Borders)
            </label>
          </div>
        </div>

        {/* Extension Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Outlet 1: VIP Rewards */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeOutlets.vipRewards ? 'bg-purple-50/70 border-purple-300 shadow-sm' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-purple-700">
                  Outlet: ProductDetails.Actions
                </div>
                <div className="font-semibold text-slate-900 text-sm mt-0.5">
                  VIP Rewards Member Teaser
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Position: <span className="font-mono font-bold text-amber-700">BEFORE</span> Add to Cart CTA
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleOutlet('vipRewards')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  activeOutlets.vipRewards
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {activeOutlets.vipRewards ? 'Detach' : 'Inject'}
              </button>
            </div>
          </div>

          {/* Outlet 2: Buyer Trust */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeOutlets.buyerTrust ? 'bg-purple-50/70 border-purple-300 shadow-sm' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-purple-700">
                  Outlet: ProductDetails.Actions
                </div>
                <div className="font-semibold text-slate-900 text-sm mt-0.5">
                  Verified Buyer Protection & Warranty
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Position: <span className="font-mono font-bold text-emerald-700">AFTER</span> Add to Cart CTA
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleOutlet('buyerTrust')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  activeOutlets.buyerTrust
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {activeOutlets.buyerTrust ? 'Detach' : 'Inject'}
              </button>
            </div>
          </div>

          {/* Outlet 3: Eco Shipping */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeOutlets.ecoShipping ? 'bg-purple-50/70 border-purple-300 shadow-sm' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-purple-700">
                  Outlet: Cart.Summary
                </div>
                <div className="font-semibold text-slate-900 text-sm mt-0.5">
                  100% Carbon-Neutral Shipping Seal
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Position: <span className="font-mono font-bold text-emerald-700">AFTER</span> Order Summary
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleOutlet('ecoShipping')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  activeOutlets.ecoShipping
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {activeOutlets.ecoShipping ? 'Detach' : 'Inject'}
              </button>
            </div>
          </div>

          {/* Outlet 4: Flash Sale */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeOutlets.flashSale ? 'bg-purple-50/70 border-purple-300 shadow-sm' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-purple-700">
                  Outlet: CmsComponent.SimpleResponsiveBannerComponent
                </div>
                <div className="font-semibold text-slate-900 text-sm mt-0.5">
                  Urgent Flash Sale Countdown Ticker
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Position: <span className="font-mono font-bold text-amber-700">BEFORE</span> Hero Banners
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleOutlet('flashSale')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  activeOutlets.flashSale
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {activeOutlets.flashSale ? 'Detach' : 'Inject'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Test Navigation Links */}
        <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-base">🚀</span>
            <span>Test your injected outlets live in the storefront:</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button href="/products/CONF-DEMO-001" variant="outline" size="sm" className="text-white border-slate-600 hover:bg-slate-800">
              View Product Page &rarr;
            </Button>
            <Button href="/cart" variant="outline" size="sm" className="text-white border-slate-600 hover:bg-slate-800">
              View Cart Page &rarr;
            </Button>
            <Button href="/" variant="outline" size="sm" className="text-white border-slate-600 hover:bg-slate-800">
              View Homepage &rarr;
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Deep SmartEdit Integration & Authoring Studio (Phase 2 Task 4) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="info">Phase 2 Task 4</Badge>
              <span className="text-xs font-mono text-blue-600 font-bold">SAP SmartEdit Contract</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              Deep SmartEdit In-Context Authoring Studio
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Bidirectional <code>postMessage</code> protocol, WYSIWYG slot reordering, live component editing modals, and multi-perspective authoring.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={isAuthoringMode ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => {
                setPerspective(isAuthoringMode ? 'PREVIEW' : 'ADVANCED_EDIT');
                setToolbarVisible(true);
              }}
            >
              {isAuthoringMode ? 'Switch to Preview Mode' : '🚀 Launch Advanced Edit Mode'}
            </Button>
          </div>
        </div>

        {/* SmartEdit Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <span>🖼️</span>
              <span>In-Context Component Overlays</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              When in Edit mode, hovering over any slot reveals contextual action pills to <strong>Edit</strong> properties in real-time, <strong>Move Up/Down</strong>, <strong>Clone</strong>, or <strong>Delete</strong> components.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <span>➕</span>
              <span>Slot Component Picker</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Each slot features a <strong>"+ Add Component"</strong> button that opens the SmartEdit Component Catalog modal to insert any of the 9 registered CMS component types with one click.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <span>📡</span>
              <span>postMessage Event Bridge</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Storefront responds to <code>SMARTEDIT_STOREFRONT_READY</code>, <code>SMARTEDIT_RE_RENDER_COMPONENTS</code>, and perspective changes dispatched by SAP Commerce Backoffice iframes.
            </p>
          </div>
        </div>

        {/* Current Authoring Status Banner */}
        <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isAuthoringMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span>Current Perspective: <span className="text-amber-300 font-bold">{perspective}</span></span>
            <span className="text-slate-500">|</span>
            <span>Catalog: <span className="text-blue-400 font-bold">{catalogVersion}</span></span>
          </div>
          <Button href="/" variant="outline" size="sm" className="text-white border-slate-700 hover:bg-slate-800">
            Open Homepage to Test Live Overlays &rarr;
          </Button>
        </div>
      </div>

      {/* 4. Expanded CMS Component Library (Phase 2 Task 3) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center space-x-2">
            <Badge variant="success">Phase 2 Task 3</Badge>
            <span className="text-xs font-mono text-emerald-600 font-bold">9 Component Types</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Expanded CMS Component Library
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Full Spartan & SAP Commerce CMS component suite supported across OCC and Contentful.
          </p>
        </div>

        {/* Component Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              type: 'RotatingImagesComponent',
              name: 'Hero Image Slider',
              desc: 'Multi-slide image carousel with smooth autoplay, arrows, and dot indicators.',
              badge: 'Interactive',
            },
            {
              type: 'TabContainerComponent',
              name: 'Tabbed Content Switcher',
              desc: 'Interactive tab switcher for technical specifications, warranties, and FAQs.',
              badge: 'Container',
            },
            {
              type: 'CMSVideoComponent',
              name: 'Responsive Video Player',
              desc: 'Seamless YouTube or MP4 video playback with responsive aspect ratio.',
              badge: 'Media',
            },
            {
              type: 'SimpleResponsiveBannerComponent',
              name: 'Responsive Hero Banner',
              desc: 'High-impact promotional banner with headline, call-to-action button, and media.',
              badge: 'Banner',
            },
            {
              type: 'ProductCarouselComponent',
              name: 'Product Carousel',
              desc: 'Horizontal scroll carousel showing products with live prices and ratings.',
              badge: 'Commerce',
            },
            {
              type: 'CMSParagraphComponent',
              name: 'Rich Text Paragraph',
              desc: 'HTML or Markdown-enabled content blocks for editorial announcements.',
              badge: 'Content',
            },
            {
              type: 'CMSFlexComponent',
              name: 'Spartacus Flex Component',
              desc: 'Dynamically resolved custom frontend widget (MiniCart, Breadcrumbs, etc.).',
              badge: 'Spartacus',
            },
            {
              type: 'NavigationComponent',
              name: 'Hierarchical Navigation',
              desc: 'Multi-tier flyout category navigation tree with dropdowns.',
              badge: 'Navigation',
            },
            {
              type: 'CMSLinkComponent',
              name: 'Navigation Link',
              desc: 'Styled link or CTA button with target attributes and security rel flags.',
              badge: 'Link',
            },
          ].map((item) => (
            <div
              key={item.type}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {item.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">{item.desc}</p>
              <div className="font-mono text-[10px] text-slate-400 border-t border-slate-200 pt-1.5">
                {item.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
