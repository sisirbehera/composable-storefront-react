import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/**/__tests__/**/*.test.ts'],
    alias: {
      '@storefront/core': path.resolve(import.meta.dirname, 'packages/core/src/index.ts'),
      '@storefront/api': path.resolve(import.meta.dirname, 'packages/api/src/index.ts'),
      '@storefront/auth': path.resolve(import.meta.dirname, 'packages/auth/src/index.ts'),
      '@storefront/ui': path.resolve(import.meta.dirname, 'packages/ui/src/index.ts'),
      '@storefront/cms': path.resolve(import.meta.dirname, 'packages/cms/src/index.ts'),
    },
  },
});
