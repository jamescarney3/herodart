/// <reference types="vitest" />
import path from 'path';
import './vite-env.d.ts';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import babel from 'vite-plugin-babel';
import sassTailwindFunctions from 'sass-tailwind-functions/modern';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({ tsDecorators: true }),
    babel({
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: [['@babel/plugin-proposal-decorators', { loose: true, version: '2022-03' }]],
      },
    }),
    VitePWA({
      devOptions: { enabled: true },
      registerType: 'autoUpdate',
      manifest: {
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      test: path.resolve(__dirname, './test'),
    },
  },
  test: {
    environment: 'jsdom',
    coverage: {
      include: ['src'],
      exclude: ['src/main.tsx', 'src/index.scss', 'src/assets/*', 'src/**/index.ts', 'styles/*', '**/*.d.ts'],
      thresholds: {
        lines: 100,
        statements: 100,
        functions: 100,
        // paths: 100,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // inject tailwind funcs (theme & screen, plus a util escape func 'e')
        // into sass scope, using the project tailwind config via the installed
        // tailwind package so that it can resolve any theme extensions or
        // overrides; otherwise these wouldn't be available since sass code is
        // preprocessed
        plugins: [sassTailwindFunctions],
      },
    },
  },
  base: '/herodart',
});
