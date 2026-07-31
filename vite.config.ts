import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
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
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'SncUi',
      fileName: (format) => `snc-ui.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
