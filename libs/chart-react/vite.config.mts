/// <reference types='vitest' />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import * as path from 'path';

const root = import.meta.dirname;

export default defineConfig({
  root,
  cacheDir: '../../node_modules/.vite/libs/chart-react',
  plugins: [react()],
  resolve: {
    alias: {
      '@berrypjh/core': path.resolve(root, '../chart-core/src/index.ts'),
    },
  },
  test: {
    name: '@berrypjh/react',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
});
