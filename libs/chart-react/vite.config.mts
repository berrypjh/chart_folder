/// <reference types='vitest' />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/chart-react',
  plugins: [react()],
  resolve: {
    alias: {
      '@my-chart/core': path.resolve(__dirname, '../chart-core/src/index.ts'),
    },
  },
  test: {
    name: '@my-chart/react',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
});
