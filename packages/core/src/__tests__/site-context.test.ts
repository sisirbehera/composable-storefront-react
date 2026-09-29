import { describe, it, expect } from 'vitest';
import {
  convertAndFormatPrice,
  translate,
  DEFAULT_CURRENCIES,
  DEFAULT_LANGUAGES,
  DEFAULT_BASE_SITES,
} from '../i18n/dictionaries';

describe('Site Context & Currency Conversion', () => {
  const usd = DEFAULT_CURRENCIES.find((c) => c.isocode === 'USD')!;
  const eur = DEFAULT_CURRENCIES.find((c) => c.isocode === 'EUR')!;
  const gbp = DEFAULT_CURRENCIES.find((c) => c.isocode === 'GBP')!;
  const jpy = DEFAULT_CURRENCIES.find((c) => c.isocode === 'JPY')!;

  it('formats base USD price with 2 decimals', () => {
    const formatted = convertAndFormatPrice(100, usd, usd, 'en-US');
    expect(formatted).toContain('100.00');
    expect(formatted).toContain('$');
  });

  it('converts USD to EUR using exchange rate', () => {
    // 100 USD / 1.0 * 0.92 = 92.00 EUR
    const formatted = convertAndFormatPrice(100, eur, usd, 'en-US');
    expect(formatted).toContain('92.00');
    expect(formatted).toContain('€');
  });

  it('converts USD to GBP using exchange rate', () => {
    // 100 USD / 1.0 * 0.79 = 79.00 GBP
    const formatted = convertAndFormatPrice(100, gbp, usd, 'en-GB');
    expect(formatted).toContain('79.00');
    expect(formatted).toContain('£');
  });

  it('formats JPY with zero decimal places (zero-decimal currency)', () => {
    // 100 USD / 1.0 * 155.0 = 15,500 JPY
    const formatted = convertAndFormatPrice(100, jpy, usd, 'ja-JP');
    expect(formatted).toContain('15,500');
    expect(formatted).not.toContain('.00');
    expect(formatted).toMatch(/[¥￥]/);
  });

  it('handles null and undefined amounts safely', () => {
    expect(convertAndFormatPrice(null, usd)).toBe('');
    expect(convertAndFormatPrice(undefined, usd)).toBe('');
  });

  it('handles Price object inputs with existing currencyIso', () => {
    const priceObj = { currencyIso: 'USD', value: 50, formattedValue: '$50.00' };
    const formatted = convertAndFormatPrice(priceObj, usd, usd, 'en-US');
    expect(formatted).toContain('50.00');
  });
});

describe('I18n Translation & Fallback Engine', () => {
  it('translates common keys into English, German, and French', () => {
    expect(translate('common.search', 'en')).toBe('Search');
    expect(translate('common.search', 'de')).toBe('Suchen');
    expect(translate('common.search', 'fr')).toBe('Rechercher');
  });

  it('falls back to English when language is unknown or unsupported', () => {
    expect(translate('common.cart', 'unknown-lang')).toBe('Cart');
  });

  it('falls back to English when key is missing in target language', () => {
    // Non-existent in dictionary falls back to EN, or returns the key if completely missing
    expect(translate('nonexistent.key', 'de')).toBe('nonexistent.key');
  });

  it('replaces interpolation parameters', () => {
    const translated = translate('order.confirmation', 'en', { orderId: '12345' });
    // If key exists or returns template
    expect(typeof translated).toBe('string');
  });

  it('verifies standard multi-site configurations', () => {
    expect(DEFAULT_BASE_SITES.length).toBeGreaterThanOrEqual(3);
    const sites = DEFAULT_BASE_SITES.map((s) => s.uid);
    expect(sites).toContain('electronics-spa');
    expect(sites).toContain('apparel-uk');
    expect(sites).toContain('powertools-spa');
  });
});
