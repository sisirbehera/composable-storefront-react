'use client';

import React, { useState, useEffect } from 'react';
import { RotatingImagesComponentProperties } from '@storefront/core';

export interface RotatingImagesComponentProps {
  properties: RotatingImagesComponentProperties;
  uid?: string;
  name?: string;
}

export const RotatingImagesComponent: React.FC<RotatingImagesComponentProps> = ({
  properties,
}) => {
  const { banners = [], timeout = 5000 } = properties || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, timeout);

    return () => clearInterval(interval);
  }, [banners.length, timeout, isPaused]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div
      className="cms-rotating-images-container relative w-full my-6 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner Media Slide */}
      <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden">
        <img
          key={currentIndex}
          src={currentBanner.media?.url}
          alt={currentBanner.media?.altText || currentBanner.headline || 'Banner'}
          className="w-full h-full object-cover animate-fade-in transition-transform duration-700 hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent flex items-center">
          <div className="max-w-xl px-6 sm:px-12 text-white space-y-3">
            {currentBanner.headline && (
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {currentBanner.headline}
              </h2>
            )}
            {currentBanner.subhead && (
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
                {currentBanner.subhead}
              </p>
            )}
            {currentBanner.urlLink && (
              <a
                href={currentBanner.urlLink}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition-colors"
              >
                <span>{currentBanner.ctaText || 'Shop Now'}</span>
                <span className="ml-1.5">&rarr;</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous Slide"
          >
            &#8249;
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Next Slide"
          >
            &#8250;
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 bg-white'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
