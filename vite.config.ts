import path from 'path';
import './vite-env.d.ts';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// import sassTailwindFunctions from 'sass-tailwind-functions/modern';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({ tsDecorators: true }),
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
  css: {
    preprocessorOptions: {
      scss: {
        // inject tailwind funcs (theme & screen, plus a util escape func 'e')
        // into sass scope, using the project tailwind config via the installed
        // tailwind package so that it can resolve any theme extensions or
        // overrides; otherwise these wouldn't be available since sass code is
        // preprocessed
      },
    },
  },
  base: '/herodart',
});
