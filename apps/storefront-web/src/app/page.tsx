import React from 'react';
import { getAdapterFactory } from '@storefront/api';
import { CmsPageLayout } from '@storefront/cms';
import { appConfig } from '@/config/storefront.config';

export const revalidate = 60; // ISR revalidation cache

interface HomePageProps {
  searchParams?: Promise<{
    site?: string;
    lang?: string;
    curr?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : {};
  const factory = getAdapterFactory(appConfig);
  const cmsAdapter = factory.getCmsAdapter();
  const pageData = await cmsAdapter.getPage('homepage', params.site);

  if (!pageData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Page Not Found</h1>
        <p className="text-slate-500 mt-2">Could not retrieve homepage CMS structure.</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <CmsPageLayout
        page={pageData}
        isSmartEditEnabled={appConfig.cms.smartEdit.enabled}
      />
    </div>
  );
}
