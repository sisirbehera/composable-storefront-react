'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';

export const SiteContextSwitcher: React.FC = () => {
  const {
    activeSite,
    activeLanguage,
    activeCurrency,
    allSites,
    languages,
    currencies,
    setBaseSite,
    setLanguage,
    setCurrency,
  } = useSiteContext();

  const [siteOpen, setSiteOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);

  const siteRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (siteRef.current && !siteRef.current.contains(e.target as Node)) {
        setSiteOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (currRef.current && !currRef.current.contains(e.target as Node)) {
        setCurrOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getFlag = (isocode: string) => {
    switch (isocode.toLowerCase()) {
      case 'en': return '🇺🇸';
      case 'de': return '🇩🇪';
      case 'fr': return '🇫🇷';
      case 'ja': return '🇯🇵';
      case 'es': return '🇪🇸';
      default: return '🌐';
    }
  };

  return (
    <div className="flex items-center space-x-3 text-xs">
      {/* 1. Base Site Selector */}
      <div className="relative" ref={siteRef}>
        <button
          type="button"
          onClick={() => {
            setSiteOpen(!siteOpen);
            setLangOpen(false);
            setCurrOpen(false);
          }}
          className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
          aria-label="Select Store"
        >
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="font-semibold text-slate-100 max-w-[120px] truncate">{activeSite.name}</span>
          <span className="text-[10px] bg-blue-900/60 text-blue-300 font-bold px-1 rounded">
            {activeSite.channel}
          </span>
          <svg className={`w-3 h-3 text-slate-400 transition-transform ${siteOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {siteOpen && (
          <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in duration-100">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              Select Store Instance
            </div>
            {allSites.map((site) => (
              <button
                key={site.uid}
                type="button"
                onClick={() => {
                  setBaseSite(site.uid);
                  setSiteOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                  site.uid === activeSite.uid ? 'bg-blue-50/70 font-bold text-blue-600' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">{site.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{site.uid}</div>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  site.channel === 'B2B' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {site.channel}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Language Selector */}
      <div className="relative" ref={langRef}>
        <button
          type="button"
          onClick={() => {
            setLangOpen(!langOpen);
            setSiteOpen(false);
            setCurrOpen(false);
          }}
          className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
          aria-label="Select Language"
        >
          <span>{getFlag(activeLanguage.isocode)}</span>
          <span className="font-semibold uppercase text-slate-100">{activeLanguage.isocode}</span>
          <svg className={`w-3 h-3 text-slate-400 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {langOpen && (
          <div className="absolute right-0 sm:left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in duration-100">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              Language (i18n)
            </div>
            {languages.map((lang) => (
              <button
                key={lang.isocode}
                type="button"
                onClick={() => {
                  setLanguage(lang.isocode);
                  setLangOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                  lang.isocode === activeLanguage.isocode ? 'bg-blue-50 font-bold text-blue-600' : 'text-slate-700'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{getFlag(lang.isocode)}</span>
                  <span>{lang.nativeName}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{lang.isocode}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Currency Selector */}
      <div className="relative" ref={currRef}>
        <button
          type="button"
          onClick={() => {
            setCurrOpen(!currOpen);
            setSiteOpen(false);
            setLangOpen(false);
          }}
          className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700 font-mono"
          aria-label="Select Currency"
        >
          <span className="text-amber-300 font-bold">{activeCurrency.symbol}</span>
          <span className="font-semibold text-slate-100">{activeCurrency.isocode}</span>
          <svg className={`w-3 h-3 text-slate-400 transition-transform ${currOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {currOpen && (
          <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in duration-100">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              Currency
            </div>
            {currencies.map((curr) => (
              <button
                key={curr.isocode}
                type="button"
                onClick={() => {
                  setCurrency(curr.isocode);
                  setCurrOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                  curr.isocode === activeCurrency.isocode ? 'bg-blue-50 font-bold text-blue-600' : 'text-slate-700'
                }`}
              >
                <span className="flex items-center space-x-2 font-mono">
                  <span className="w-5 text-center font-bold text-amber-600">{curr.symbol}</span>
                  <span>{curr.isocode}</span>
                </span>
                <span className="text-[10px] text-slate-400">{curr.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
