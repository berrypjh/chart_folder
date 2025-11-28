import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.stories.tsx', '**/*.stories.ts'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
  {
    files: ['**/.storybook/**'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
  {
    ignores: ['**/out-tsc'],
  },
];
