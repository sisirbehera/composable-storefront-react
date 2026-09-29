'use client';

import React from 'react';
import { CmsComponent } from '@storefront/core';
import { useSmartEdit } from './SmartEditContext';

interface ComponentTemplate {
  typeCode: string;
  name: string;
  description: string;
  icon: string;
  defaultProperties: Record<string, any>;
}

const componentTemplates: ComponentTemplate[] = [
  {
    typeCode: 'SimpleResponsiveBannerComponent',
    name: 'Responsive Hero Banner',
    description: 'High-impact promotional banner with headline, call-to-action button, and background imagery.',
    icon: '🖼️',
    defaultProperties: {
      headline: 'New SmartEdit Promotional Announcement',
      content: 'Freshly authored directly from the SAP SmartEdit in-context studio.',
      urlLink: '/search',
      media: {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
        altText: 'New SmartEdit Banner',
      },
    },
  },
  {
    typeCode: 'CMSParagraphComponent',
    name: 'Rich Text Paragraph',
    description: 'Flexible text section for editorial copy, marketing notices, or announcements.',
    icon: '📝',
    defaultProperties: {
      content: '### Fresh Editorial Section\n\nAuthored seamlessly via SmartEdit Authoring Studio. Edit this text block at any time.',
    },
  },
  {
    typeCode: 'CMSVideoComponent',
    name: 'Responsive Video Player',
    description: 'Embed streaming product videos, YouTube tutorials, or brand commercials.',
    icon: '🎥',
    defaultProperties: {
      title: 'Featured Product Showcase',
      caption: 'Experience industry-leading acoustic performance and noise cancellation.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  },
  {
    typeCode: 'ProductCarouselComponent',
    name: 'Product Carousel',
    description: 'Interactive carousel displaying selected SKUs with live prices and ratings.',
    icon: '🛍️',
    defaultProperties: {
      title: 'Trending Recommended Gear',
      productCodes: ['CONF-DEMO-001', 'CONF-DEMO-002', 'CONF-DEMO-003', 'CONF-DEMO-004'],
    },
  },
  {
    typeCode: 'RotatingImagesComponent',
    name: 'Hero Image Slider',
    description: 'Multi-slide image carousel with smooth autoplay, pagination dots, and navigation arrows.',
    icon: '🎠',
    defaultProperties: {
      timeout: 4000,
      banners: [
        {
          headline: 'Next-Gen Wireless Noise Cancellation',
          subhead: 'Engineered for true audiophile precision with dual high-resolution DACs.',
          media: {
            url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80',
            altText: 'Audio Slide 1',
          },
          urlLink: '/category/audio',
          ctaText: 'Shop Headphones',
        },
      ],
    },
  },
  {
    typeCode: 'TabContainerComponent',
    name: 'Tabbed Paragraph Container',
    description: 'Interactive tab switcher for technical specs, warranty, and FAQs.',
    icon: '📑',
    defaultProperties: {
      title: 'Product Information Center',
      tabs: [
        { id: 'tab-1', title: 'Specifications', content: 'Bluetooth 5.2 • 30-hour battery life • Active Noise Cancellation' },
        { id: 'tab-2', title: 'Shipping & Returns', content: 'Free standard shipping on all orders over $50. 30-day return policy.' },
      ],
    },
  },
  {
    typeCode: 'CMSLinkComponent',
    name: 'Navigation Link',
    description: 'Styled link or action button pointing to internal catalog routes or external pages.',
    icon: '🔗',
    defaultProperties: {
      linkName: 'Explore Full Collection',
      url: '/search',
      target: '_self',
    },
  },
  {
    typeCode: 'CMSFlexComponent',
    name: 'Spartacus Flex Component',
    description: 'Dynamic frontend widget container resolved at runtime via flexType.',
    icon: '🧩',
    defaultProperties: {
      flexType: 'MiniCartComponent',
    },
  },
];

export const SmartEditComponentPickerModal: React.FC = () => {
  const { pickerSlotId, setPickerSlotId, addComponentToSlot } = useSmartEdit();

  if (!pickerSlotId) {
    return null;
  }

  const handleSelectTemplate = (template: ComponentTemplate) => {
    const newComponent: CmsComponent = {
      uid: `comp-${template.typeCode.toLowerCase()}-${Date.now().toString(36)}`,
      typeCode: template.typeCode,
      name: template.name,
      properties: JSON.parse(JSON.stringify(template.defaultProperties)),
    };

    addComponentToSlot(pickerSlotId, newComponent);
    setPickerSlotId(null);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-blue-400">
              SAP SmartEdit Component Catalog
            </div>
            <h2 className="text-base font-extrabold tracking-tight mt-0.5">
              Add Component to Slot: <span className="text-amber-300 font-mono">{pickerSlotId}</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setPickerSlotId(null)}
            className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Component Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
          {componentTemplates.map((tpl) => (
            <button
              key={tpl.typeCode}
              type="button"
              onClick={() => handleSelectTemplate(tpl)}
              className="text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="text-xl">{tpl.icon}</span>
                  <span className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                    {tpl.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {tpl.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{tpl.typeCode}</span>
                <span className="text-blue-600 font-bold group-hover:underline">+ Add</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
