import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  ThemeProvider,
  useTheme,
  getInitialTheme,
  resolveAppliedTheme,
  STORAGE_KEY,
  ThemeToggle,
} from '../index';

class MockStorage implements Storage {
  private store = new Map<string, string>();
  get length() { return this.store.size; }
  clear() { this.store.clear(); }
  getItem(key: string) { return this.store.get(key) ?? null; }
  key(index: number) { return Array.from(this.store.keys())[index] ?? null; }
  removeItem(key: string) { this.store.delete(key); }
  setItem(key: string, value: string) { this.store.set(key, String(value)); }
}

describe('Theme System: Context, Resolution & Toggle', () => {
  let mockStorage: MockStorage;
  const originalWindow = globalThis.window;

  beforeEach(() => {
    mockStorage = new MockStorage();

    const mockDocumentElement = {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(),
        toggle: vi.fn(),
      },
    };

    (globalThis as any).document = {
      documentElement: mockDocumentElement,
    };

    (globalThis as any).window = {
      document: (globalThis as any).document,
      localStorage: mockStorage,
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    };

    (globalThis as any).localStorage = mockStorage;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getInitialTheme()', () => {
    it('defaults to light view when no preference is saved in localStorage', () => {
      expect(mockStorage.getItem(STORAGE_KEY)).toBeNull();
      const initial = getInitialTheme();
      expect(initial).toBe('light');
    });

    it('returns stored "dark" preference if present in localStorage', () => {
      mockStorage.setItem(STORAGE_KEY, 'dark');
      expect(getInitialTheme()).toBe('dark');
    });

    it('returns stored "system" preference if present in localStorage', () => {
      mockStorage.setItem(STORAGE_KEY, 'system');
      expect(getInitialTheme()).toBe('system');
    });

    it('falls back to "light" if an invalid or unrecognized theme string is stored', () => {
      mockStorage.setItem(STORAGE_KEY, 'high-contrast-neon');
      expect(getInitialTheme()).toBe('light');
    });
  });

  describe('resolveAppliedTheme()', () => {
    it('resolves explicit "light" theme to "light"', () => {
      expect(resolveAppliedTheme('light')).toBe('light');
    });

    it('resolves explicit "dark" theme to "dark"', () => {
      expect(resolveAppliedTheme('dark')).toBe('dark');
    });

    it('resolves "system" to "dark" when prefers-color-scheme: dark matches', () => {
      (globalThis.window.matchMedia as any) = vi.fn().mockReturnValue({ matches: true });
      expect(resolveAppliedTheme('system')).toBe('dark');
    });

    it('resolves "system" to "light" when prefers-color-scheme: dark does not match', () => {
      (globalThis.window.matchMedia as any) = vi.fn().mockReturnValue({ matches: false });
      expect(resolveAppliedTheme('system')).toBe('light');
    });

    it('resolves "system" to "light" when matchMedia is unavailable', () => {
      delete (globalThis.window as any).matchMedia;
      expect(resolveAppliedTheme('system')).toBe('light');
    });
  });

  describe('useTheme() Hook Fallback & Provider', () => {
    it('provides safe fallback light values when rendered outside ThemeProvider', () => {
      let captured: any = null;
      function TestConsumer() {
        captured = useTheme();
        return React.createElement('div', null, captured.theme);
      }

      const html = renderToString(React.createElement(TestConsumer));
      expect(html).toContain('light');
      expect(captured).not.toBeNull();
      expect(captured.theme).toBe('light');
      expect(captured.resolvedTheme).toBe('light');
      expect(typeof captured.setTheme).toBe('function');
      expect(typeof captured.toggleTheme).toBe('function');
    });

    it('passes theme and resolvedTheme through ThemeProvider context', () => {
      let captured: any = null;
      function TestConsumer() {
        captured = useTheme();
        return React.createElement('span', null, `active:${captured.theme}:${captured.resolvedTheme}`);
      }

      const html = renderToString(
        React.createElement(
          ThemeProvider,
          { defaultTheme: 'dark' },
          React.createElement(TestConsumer)
        )
      );

      expect(html).toContain('active:dark:dark');
      expect(captured.theme).toBe('dark');
      expect(captured.resolvedTheme).toBe('dark');
    });

    it('defaults ThemeProvider to "light" if defaultTheme is omitted', () => {
      let captured: any = null;
      function TestConsumer() {
        captured = useTheme();
        return React.createElement('span', null, `active:${captured.theme}`);
      }

      const html = renderToString(
        React.createElement(ThemeProvider, null, React.createElement(TestConsumer))
      );

      expect(html).toContain('active:light');
      expect(captured.theme).toBe('light');
      expect(captured.resolvedTheme).toBe('light');
    });
  });

  describe('ThemeToggle Component', () => {
    it('renders light-mode toggle button with "Switch to dark theme" accessibility label by default', () => {
      const html = renderToString(React.createElement(ThemeToggle));
      expect(html).toContain('aria-label="Switch to dark theme"');
      expect(html).toContain('title="Switch to dark theme"');
      // SVG Moon icon path is rendered
      expect(html).toContain('M20.354 15.354A9 9 0 018.646 3.646');
    });

    it('renders with label text when showLabel is true', () => {
      const html = renderToString(React.createElement(ThemeToggle, { showLabel: true }));
      expect(html).toContain('Dark');
    });

    it('renders dark-mode toggle button with "Switch to light theme" when wrapped in dark ThemeProvider', () => {
      const html = renderToString(
        React.createElement(
          ThemeProvider,
          { defaultTheme: 'dark' },
          React.createElement(ThemeToggle, { showLabel: true })
        )
      );
      expect(html).toContain('aria-label="Switch to light theme"');
      expect(html).toContain('Light');
      // SVG Sun icon path is rendered
      expect(html).toContain('M12 3v1m0 16v1m9-9h-1M4 12H3');
    });

    it('applies custom className to the toggle button', () => {
      const html = renderToString(React.createElement(ThemeToggle, { className: 'custom-navbar-toggle' }));
      expect(html).toContain('custom-navbar-toggle');
    });
  });
});
