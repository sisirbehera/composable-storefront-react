import React from 'react';
import { BannerComponentProperties } from '@storefront/core';
import { Button } from '@storefront/ui';

export interface BannerComponentProps {
  properties: BannerComponentProperties;
}

export const BannerComponent: React.FC<BannerComponentProps> = ({ properties }) => {
  const { headline, content, media, urlLink } = properties;

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-900 text-white my-6">
      {media?.url && (
        <div className="absolute inset-0 z-0">
          <img
            src={media.url}
            alt={media.altText || headline || 'Banner Image'}
            className="w-full h-full object-cover object-center opacity-40 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
        {headline && (
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            {headline}
          </h2>
        )}

        {content && (
          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed font-normal">
            {content}
          </p>
        )}

        {urlLink && (
          <Button href={urlLink} size="lg" variant="primary">
            Explore Collection &rarr;
          </Button>
        )}
      </div>
    </div>
  );
};
