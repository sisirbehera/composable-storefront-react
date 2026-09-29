'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  BaseSite,
  Currency,
  Language,
  Price,
  DEFAULT_BASE_SITES,
  DEFAULT_CURRENCIES,
  DEFAULT_LANGUAGES,
  convertAndFormatPrice,
  translate,
} from '@storefront/core';

export interface SiteContextType {
  activeSite: BaseSite;
  activeLanguage: Language;
  activeCurrency: Currency;
  allSites: BaseSite[];
  languages: Language[];
  currencies: Currency[];
  setBaseSite: (siteId: string) => void;
  setLanguage: (langCode: string) => void;
  setCurrency: (currCode: string) => void;
  formatPrice: (amount: number | Price | undefined | null, overrideCurrency?: string) => string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const STORAGE_SITE_KEY = 'storefront_base_site';
const STORAGE_LANG_KEY = 'storefront_language';
const STORAGE_CURR_KEY = 'storefront_currency';

export interface SiteContextProviderProps {
  children: React.ReactNode;
  initialSites?: BaseSite[];
  defaultSiteId?: string;
  onSiteChange?: (site: BaseSite, newUrl: string) => void;
}

export const SiteContextProvider: React.FC<SiteContextProviderProps> = ({
  children,
  initialSites = DEFAULT_BASE_SITES,
  defaultSiteId = 'electronics-spa',
  onSiteChange,
}) => {
  const allSites = initialSites;
  const initialSite = allSites.find((s) => s.uid === defaultSiteId) || allSites[0];

  const [activeSite, setActiveSite] = useState<BaseSite>(initialSite);
  const [activeLanguage, setActiveLanguage] = useState<Language>(
    initialSite.languages.find((l) => l.isocode === initialSite.defaultLanguage) || initialSite.languages[0]
  );
  const [activeCurrency, setActiveCurrency] = useState<Currency>(
    initialSite.currencies.find((c) => c.isocode === initialSite.defaultCurrency) || initialSite.currencies[0]
  );

  // Synchronize site context from URL query params and localStorage
  const syncFromUrlOrStorage = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSiteId = urlParams.get('site');
      const urlLangCode = urlParams.get('lang');
      const urlCurrCode = urlParams.get('curr');

      const storedSiteId = localStorage.getItem(STORAGE_SITE_KEY);
      const storedLangCode = localStorage.getItem(STORAGE_LANG_KEY);
      const storedCurrCode = localStorage.getItem(STORAGE_CURR_KEY);

      // Determine Target Site: URL param > localStorage > defaultSite
      const targetSiteId = urlSiteId || storedSiteId || defaultSiteId;
      const targetSite = allSites.find((s) => s.uid === targetSiteId) || initialSite;
      setActiveSite(targetSite);
      localStorage.setItem(STORAGE_SITE_KEY, targetSite.uid);

      // Determine Target Language: URL param > localStorage > site default
      const targetLangCode = urlLangCode || storedLangCode || targetSite.defaultLanguage;
      const targetLang =
        targetSite.languages.find((l) => l.isocode === targetLangCode) ||
        targetSite.languages.find((l) => l.isocode === targetSite.defaultLanguage) ||
        targetSite.languages[0];
      setActiveLanguage(targetLang);
      localStorage.setItem(STORAGE_LANG_KEY, targetLang.isocode);

      // Determine Target Currency: URL param > localStorage > site default
      const targetCurrCode = urlCurrCode || storedCurrCode || targetSite.defaultCurrency;
      const targetCurr =
        targetSite.currencies.find((c) => c.isocode === targetCurrCode) ||
        targetSite.currencies.find((c) => c.isocode === targetSite.defaultCurrency) ||
        targetSite.currencies[0];
      setActiveCurrency(targetCurr);
      localStorage.setItem(STORAGE_CURR_KEY, targetCurr.isocode);

      // Ensure URL parameters reflect the active context without full reload
      const currentUrl = new URL(window.location.href);
      let urlChanged = false;

      if (currentUrl.searchParams.get('site') !== targetSite.uid) {
        currentUrl.searchParams.set('site', targetSite.uid);
        urlChanged = true;
      }
      if (currentUrl.searchParams.get('lang') !== targetLang.isocode) {
        currentUrl.searchParams.set('lang', targetLang.isocode);
        urlChanged = true;
      }
      if (currentUrl.searchParams.get('curr') !== targetCurr.isocode) {
        currentUrl.searchParams.set('curr', targetCurr.isocode);
        urlChanged = true;
      }

      if (urlChanged) {
        window.history.replaceState(null, '', currentUrl.pathname + currentUrl.search);
      }
    } catch (e) {
      console.warn('[SiteContextProvider] Failed to sync context with URL/localStorage:', e);
    }
  }, [allSites, defaultSiteId, initialSite]);

  // Restore site context from URL/localStorage on client mount & listen for popstate
  useEffect(() => {
    syncFromUrlOrStorage();

    const handlePopState = () => {
      syncFromUrlOrStorage();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncFromUrlOrStorage]);

  const setBaseSite = useCallback(
    (siteId: string) => {
      const site = allSites.find((s) => s.uid === siteId);
      if (!site) return;

      setActiveSite(site);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_SITE_KEY, site.uid);

        const newLang =
          site.languages.find((l: Language) => l.isocode === site.defaultLanguage) || site.languages[0];
        const newCurr =
          site.currencies.find((c: Currency) => c.isocode === site.defaultCurrency) || site.currencies[0];

        setActiveLanguage(newLang);
        localStorage.setItem(STORAGE_LANG_KEY, newLang.isocode);

        setActiveCurrency(newCurr);
        localStorage.setItem(STORAGE_CURR_KEY, newCurr.isocode);

        const url = new URL(window.location.href);
        url.searchParams.set('site', site.uid);
        url.searchParams.set('lang', newLang.isocode);
        url.searchParams.set('curr', newCurr.isocode);

        // If on a PDP or deep path, navigating to root of new store is safer since product SKU may not exist
        const isProductDetail = url.pathname.startsWith('/products/');
        const targetUrl = isProductDetail
          ? `/?site=${site.uid}&lang=${newLang.isocode}&curr=${newCurr.isocode}`
          : `${url.pathname}?${url.searchParams.toString()}`;

        if (onSiteChange) {
          onSiteChange(site, targetUrl);
        } else {
          window.location.href = targetUrl;
        }
      }
    },
    [allSites, onSiteChange]
  );

  const setLanguage = useCallback(
    (langCode: string) => {
      const lang = activeSite.languages.find((l: Language) => l.isocode === langCode);
      if (lang) {
        setActiveLanguage(lang);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_LANG_KEY, lang.isocode);
          const url = new URL(window.location.href);
          url.searchParams.set('lang', lang.isocode);
          window.history.replaceState(null, '', url.pathname + url.search);
        }
      }
    },
    [activeSite.languages]
  );

  const setCurrency = useCallback(
    (currCode: string) => {
      const curr = activeSite.currencies.find((c: Currency) => c.isocode === currCode);
      if (curr) {
        setActiveCurrency(curr);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_CURR_KEY, curr.isocode);
          const url = new URL(window.location.href);
          url.searchParams.set('curr', curr.isocode);
          window.history.replaceState(null, '', url.pathname + url.search);
        }
      }
    },
    [activeSite.currencies]
  );

  // Format price using core convertAndFormatPrice
  const formatPrice = useCallback((
    amount: number | Price | undefined | null,
    overrideCurrency?: string
  ): string => {
    const targetIso = overrideCurrency || activeCurrency.isocode;
    const targetCurr = activeSite.currencies.find((c: Currency) => c.isocode === targetIso) || activeCurrency;
    return convertAndFormatPrice(amount, targetCurr, undefined, activeLanguage.isocode);
  }, [activeCurrency, activeLanguage.isocode, activeSite.currencies]);

  // Translate using core translate
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    return translate(key, activeLanguage.isocode, params);
  }, [activeLanguage.isocode]);

  const value = useMemo(() => ({
    activeSite,
    activeLanguage,
    activeCurrency,
    allSites,
    languages: activeSite.languages,
    currencies: activeSite.currencies,
    setBaseSite,
    setLanguage,
    setCurrency,
    formatPrice,
    t,
  }), [activeSite, activeLanguage, activeCurrency, allSites, setBaseSite, setLanguage, setCurrency, formatPrice, t]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

export function useSiteContext(): SiteContextType {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, activeLanguage } = useSiteContext();
  return { t, language: activeLanguage.isocode };
}
