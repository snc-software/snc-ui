import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@/Components': fileURLToPath(new URL('./src/Components', import.meta.url)),
      '@/Internal': fileURLToPath(new URL('./src/Internal', import.meta.url)),
      '@/Shared': fileURLToPath(new URL('./src/Shared', import.meta.url)),
      '@/Types': fileURLToPath(new URL('./src/Types', import.meta.url)),
      '@/Utils': fileURLToPath(new URL('./src/Utils', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
});
