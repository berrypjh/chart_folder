import nx from '@nx/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/vitest.config.*.timestamp*',
      '**/vite.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [
            '^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$',
            '^@berrypjh/(core|react|shared-data)$',
          ],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
          allowCircularSelfDependency: true,
        },
      ],
    },
  },
  {
    files: ['**/*.stories.tsx', '**/*.stories.ts', '**/*.stories.jsx', '**/*.stories.js'],
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
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
    },
  },
];
