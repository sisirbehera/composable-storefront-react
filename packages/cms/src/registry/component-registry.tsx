'use client';

import React from 'react';
import { BannerComponent } from '../components/BannerComponent';
import { ParagraphComponent } from '../components/ParagraphComponent';
import { ProductCarouselComponent } from '../components/ProductCarouselComponent';
import { FlexComponent } from '../components/FlexComponent';
import { LinkComponent } from '../components/LinkComponent';
import { NavigationComponent } from '../components/NavigationComponent';
import { TabContainerComponent } from '../components/TabContainerComponent';
import { VideoComponent } from '../components/VideoComponent';
import { RotatingImagesComponent } from '../components/RotatingImagesComponent';

export type CmsComponentRenderer<P = any> = React.ComponentType<{
  properties: P;
  uid?: string;
  name?: string;
}>;

const registry: Record<string, CmsComponentRenderer> = {
  // Banners
  SimpleResponsiveBannerComponent: BannerComponent,
  BannerComponent: BannerComponent,
  SimpleBannerComponent: BannerComponent,

  // Text & Rich Content
  CMSParagraphComponent: ParagraphComponent,
  ParagraphComponent: ParagraphComponent,

  // Carousels & Sliders
  ProductCarouselComponent: ProductCarouselComponent,
  RotatingImagesComponent: RotatingImagesComponent,
  HeroSliderComponent: RotatingImagesComponent,

  // Navigation & Links
  CMSLinkComponent: LinkComponent,
  LinkComponent: LinkComponent,
  NavigationComponent: NavigationComponent,
  CategoryNavigationComponent: NavigationComponent,

  // Interactive Containers & Media
  TabContainerComponent: TabContainerComponent,
  CMSTabParagraphContainer: TabContainerComponent,
  CMSVideoComponent: VideoComponent,
  MediaContainerComponent: VideoComponent,
  VideoComponent: VideoComponent,

  // Spartacus Flex
  CMSFlexComponent: FlexComponent,
  FlexComponent: FlexComponent,
};

export const UnknownCmsComponent: React.FC<{ properties: any; uid?: string; name?: string; typeCode?: string }> = ({
  uid,
  typeCode,
  properties,
}) => {
  return (
    <div className="p-4 my-4 border border-dashed border-amber-300 bg-amber-50 rounded-lg text-xs font-mono text-amber-800">
      <div className="font-bold">Unknown CMS Component: {typeCode}</div>
      <div className="text-slate-500">UID: {uid}</div>
      <pre className="mt-2 p-2 bg-amber-100/50 rounded overflow-x-auto text-[10px]">
        {JSON.stringify(properties, null, 2)}
      </pre>
    </div>
  );
};

export class CmsComponentRegistry {
  static getComponent(typeCode: string): CmsComponentRenderer {
    return registry[typeCode] || UnknownCmsComponent;
  }

  static register(typeCode: string, component: CmsComponentRenderer): void {
    registry[typeCode] = component;
  }

  static getAllRegisteredTypes(): string[] {
    return Object.keys(registry);
  }
}
