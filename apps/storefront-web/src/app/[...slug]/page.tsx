import React from 'react';
import { notFound } from 'next/navigation';
import { getAdapterFactory } from '@storefront/api';
import { CmsPageLayout } from '@storefront/cms';
import { appConfig } from '@/config/storefront.config';

interface CmsDynamicPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams?: Promise<{
    site?: string;
    lang?: string;
    curr?: string;
  }>;
}

export default async function CmsDynamicPage({ params, searchParams }: CmsDynamicPageProps) {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const path = slug.join('/');

  const factory = getAdapterFactory(appConfig);
  const cmsAdapter = factory.getCmsAdapter();
  const pageData = await cmsAdapter.getPage(path, sParams.site);

  if (!pageData) {
    notFound();
  }

  return (
    <div className="page-wrapper py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {pageData.title || path}
        </h1>
        {pageData.description && (
          <p className="text-slate-500 text-sm mt-1">{pageData.description}</p>
        )}
      </div>
      <CmsPageLayout
        page={pageData}
        isSmartEditEnabled={appConfig.cms.smartEdit.enabled}
      />
    </div>
  );
}
