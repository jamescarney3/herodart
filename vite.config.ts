/// <reference types="vitest" />
import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import sassTailwindFunctions from 'sass-tailwind-functions/modern';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
});
