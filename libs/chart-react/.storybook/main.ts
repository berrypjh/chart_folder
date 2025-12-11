import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import * as path from 'path';

const root = import.meta.dirname;

const config: StorybookConfig = {
  stories: ['../src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@berrypjh/core': path.resolve(root, '../../chart-core/src/index.ts'),
        },
        extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      },
      optimizeDeps: {
        exclude: [
          'react-native',
          '@react-native-community/cli',
          '@react-native-community/cli-platform-android',
          '@react-native-community/cli-platform-ios',
          '@react-native/metro-config',
          '@react-native/babel-preset',
          'metro-config',
          'metro-resolver',
          '@expo/metro-config',
          '@expo/metro-runtime',
          'expo',
          'expo-splash-screen',
          'expo-status-bar',
          'expo-system-ui',
          'react-native-svg',
          'react-native-svg-transformer',
          'babel-preset-expo',
        ],
        include: ['react', 'react-dom', 'react/jsx-runtime'],
      },
      define: {
        __DEV__: 'true',
        'process.env.NODE_ENV': '"development"',
      },
      server: {
        fs: {
          deny: [
            '**/node_modules/@react-native/**',
            '**/node_modules/metro-config/**',
            '**/node_modules/@expo/metro-config/**',
          ],
        },
      },
      build: {
        commonjsOptions: {
          exclude: [
            'react-native',
            '@react-native-community/cli',
            '@react-native/metro-config',
            'metro-config',
            'metro-resolver',
            '@expo/metro-config',
            '@expo/metro-runtime',
            'expo',
          ],
        },
      },
      esbuild: {
        loader: 'tsx',
        include: /\.(tsx?|jsx)$/,
        exclude: [],
      },
    });
  },
};

export default config;
