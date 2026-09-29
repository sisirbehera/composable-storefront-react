export interface Language {
  isocode: string;
  name: string;
  nativeName: string;
  active?: boolean;
}

export interface Currency {
  isocode: string;
  symbol: string;
  name: string;
  rate: number; // Conversion rate relative to USD (1.0)
  active?: boolean;
}

export interface BaseSite {
  uid: string;
  name: string;
  defaultLanguage: string;
  languages: Language[];
  defaultCurrency: string;
  currencies: Currency[];
  channel: 'B2C' | 'B2B';
  theme?: string;
  urlPatterns?: string[];
}

export interface SiteContextState {
  activeSite: BaseSite;
  activeLanguage: Language;
  activeCurrency: Currency;
  allSites: BaseSite[];
  languages: Language[];
  currencies: Currency[];
}
