'use client';

import React from 'react';
import { VideoComponentProperties } from '@storefront/core';

export interface VideoComponentProps {
  properties: VideoComponentProperties;
  uid?: string;
  name?: string;
}

export const VideoComponent: React.FC<VideoComponentProps> = ({
  properties,
}) => {
  const {
    videoUrl,
    title,
    caption,
    posterUrl,
    autoplay = false,
    loop = false,
  } = properties || {};

  if (!videoUrl) {
    return null;
  }

  // Parse YouTube or Vimeo
  const getEmbedUrl = (url: string): string | null => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
          videoId = new URL(url).searchParams.get('v') || '';
        }
        return videoId
          ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}`
          : null;
      }
      if (url.includes('vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1].split('?')[0];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
      }
    } catch {
      return null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="cms-video-container my-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
      {title && (
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
          {title}
        </h2>
      )}
      {caption && <p className="text-xs text-slate-500 mb-4">{caption}</p>}

      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title || 'Embedded Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <video
            src={videoUrl}
            poster={posterUrl}
            controls
            autoPlay={autoplay}
            loop={loop}
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
};
