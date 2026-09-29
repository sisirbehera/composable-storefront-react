import React from 'react';
import { LinkComponentProperties } from '@storefront/core';

export interface LinkComponentProps {
  properties: LinkComponentProperties;
  uid?: string;
  name?: string;
}

export const LinkComponent: React.FC<LinkComponentProps> = ({
  properties,
}) => {
  const { linkName, url, target = '_self', styleClasses = '', styleAttributes = '' } = properties || {};

  const isExternal = target === '_blank' || url?.startsWith('http');

  const defaultClasses =
    'inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group';

  return (
    <a
      href={url || '#'}
      target={target}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`${defaultClasses} ${styleClasses}`}
    >
      <span>{linkName || 'Learn More'}</span>
      {isExternal && (
        <svg
          className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-blue-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </a>
  );
};
