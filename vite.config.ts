/// <reference types="vitest" />
import path from 'path';
import './vite-env.d.ts';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import babel from 'vite-plugin-babel';
import sassTailwindFunctions from 'sass-tailwind-functions/modern';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({ tsDecorators: true }),
    babel({
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: [
          ['@babel/plugin-proposal-decorators', { loose: true, version: '2022-03' }],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
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
  base: '/herodart/',
});
