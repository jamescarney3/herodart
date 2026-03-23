/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react({ tsDecorators: true })],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      test: path.resolve(__dirname, './test'),
    },
  },
  test: {
    globals: true,
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
});
