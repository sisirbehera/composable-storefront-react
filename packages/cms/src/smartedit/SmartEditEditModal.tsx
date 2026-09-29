'use client';

import React, { useState, useEffect } from 'react';
import { useSmartEdit } from './SmartEditContext';

export const SmartEditEditModal: React.FC = () => {
  const {
    activeEditingComponent,
    setActiveEditingComponent,
    updateComponentProperties,
    componentOverrides,
  } = useSmartEdit();

  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (activeEditingComponent) {
      const uid = activeEditingComponent.component.uid;
      const initialProps = {
        ...activeEditingComponent.component.properties,
        ...(componentOverrides[uid] || {}),
      };
      setFormData(JSON.parse(JSON.stringify(initialProps)));
    }
  }, [activeEditingComponent, componentOverrides]);

  if (!activeEditingComponent) {
    return null;
  }

  const { component, slotId } = activeEditingComponent;

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNestedFieldChange = (parent: string, key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [key]: value,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateComponentProperties(component.uid, formData);
    setActiveEditingComponent(null);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-blue-400">
              SAP SmartEdit Component Editor
            </div>
            <h2 className="text-base font-extrabold tracking-tight mt-0.5">
              Edit {component.name || component.typeCode}
            </h2>
            <div className="text-xs text-slate-400 font-mono">
              UID: {component.uid} {slotId ? `| Slot: ${slotId}` : ''}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveEditingComponent(null)}
            className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Banner Fields */}
          {(component.typeCode.includes('Banner') || component.typeCode === 'SimpleResponsiveBannerComponent') && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Headline Text
                </label>
                <input
                  type="text"
                  value={formData.headline || ''}
                  onChange={(e) => handleFieldChange('headline', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Content / Subtitle
                </label>
                <textarea
                  rows={3}
                  value={formData.content || ''}
                  onChange={(e) => handleFieldChange('content', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image Media URL
                </label>
                <input
                  type="text"
                  value={formData.media?.url || ''}
                  onChange={(e) => handleNestedFieldChange('media', 'url', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CTA Link URL
                </label>
                <input
                  type="text"
                  value={formData.urlLink || ''}
                  onChange={(e) => handleFieldChange('urlLink', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Paragraph / Rich Text Fields */}
          {(component.typeCode.includes('Paragraph') || component.typeCode === 'CMSParagraphComponent') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Paragraph Content (Markdown or HTML supported)
              </label>
              <textarea
                rows={6}
                value={formData.content || ''}
                onChange={(e) => handleFieldChange('content', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>
          )}

          {/* Video Fields */}
          {component.typeCode.includes('Video') && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Video URL (YouTube or MP4)
                </label>
                <input
                  type="text"
                  value={formData.videoUrl || ''}
                  onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Product Carousel Fields */}
          {component.typeCode.includes('Carousel') && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Carousel Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Codes (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.productCodes) ? formData.productCodes.join(', ') : formData.productCodes || ''}
                  onChange={(e) =>
                    handleFieldChange(
                      'productCodes',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Actions Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setActiveEditingComponent(null)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Changes to Storefront
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
