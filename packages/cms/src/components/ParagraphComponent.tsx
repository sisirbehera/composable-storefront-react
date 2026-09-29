import React from 'react';
import { ParagraphComponentProperties } from '@storefront/core';

export interface ParagraphComponentProps {
  properties: ParagraphComponentProperties;
}

export const ParagraphComponent: React.FC<ParagraphComponentProps> = ({ properties }) => {
  return (
    <div className="prose prose-slate max-w-none my-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
      <div
        dangerouslySetInnerHTML={{ __html: properties.content || '' }}
        className="text-slate-700 leading-relaxed text-sm sm:text-base space-y-3"
      />
    </div>
  );
};
