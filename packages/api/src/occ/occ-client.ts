import { OccConfig } from '@storefront/core';

export class OccClient {
  private config: OccConfig;
  private currentBaseSite?: string;
  private currentLanguage?: string;
  private currentCurrency?: string;

  constructor(config: OccConfig) {
    this.config = config;
  }

  setContext(context: { baseSite?: string; language?: string; currency?: string }): void {
    if (context.baseSite) this.currentBaseSite = context.baseSite;
    if (context.language) this.currentLanguage = context.language;
    if (context.currency) this.currentCurrency = context.currency;
  }

  private getEndpointUrl(path: string, params?: Record<string, string | number | undefined>): string {
    const cleanPrefix = this.config.prefix.endsWith('/') ? this.config.prefix : `${this.config.prefix}/`;
    const cleanBaseUrl = this.config.baseUrl.endsWith('/')
      ? this.config.baseUrl.slice(0, -1)
      : this.config.baseUrl;
    const baseSite = this.currentBaseSite || this.config.baseSite;
    const sitePath = `${cleanPrefix}${baseSite}/${path.replace(/^\//, '')}`;
    const url = new URL(sitePath, cleanBaseUrl);

    // Merge default context params
    const mergedParams: Record<string, string | number | undefined> = { ...params };
    if (this.currentLanguage && mergedParams['lang'] === undefined) {
      mergedParams['lang'] = this.currentLanguage;
    }
    if (this.currentCurrency && mergedParams['curr'] === undefined) {
      mergedParams['curr'] = this.currentCurrency;
    }

    Object.entries(mergedParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, String(val));
      }
    });

    return url.toString();
  }

  async fetch<T>(path: string, options: RequestInit = {}, params?: Record<string, string | number | undefined>): Promise<T> {
    const url = this.getEndpointUrl(path, params);
    const headers = new Headers(options.headers);
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`OCC API Error [${response.status} ${response.statusText}] at ${url}: ${errorBody}`);
    }

    // OCC sometimes returns 204 or empty bodies for DELETE / PUT
    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    return JSON.parse(text) as T;
  }

  async get<T>(path: string, params?: Record<string, string | number | undefined>, options?: RequestInit): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'GET' }, params);
  }

  async post<T>(path: string, body?: any, params?: Record<string, string | number | undefined>, options?: RequestInit): Promise<T> {
    const headers = new Headers(options?.headers);
    if (body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return this.fetch<T>(path, {
      ...options,
      method: 'POST',
      headers,
      body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    }, params);
  }

  async put<T>(path: string, body?: any, params?: Record<string, string | number | undefined>, options?: RequestInit): Promise<T> {
    const headers = new Headers(options?.headers);
    if (body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return this.fetch<T>(path, {
      ...options,
      method: 'PUT',
      headers,
      body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    }, params);
  }

  async delete<T>(path: string, params?: Record<string, string | number | undefined>, options?: RequestInit): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'DELETE' }, params);
  }
}
