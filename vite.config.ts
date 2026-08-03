import { copyFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';

function copyDesignTokens(): Plugin {
  return {
    name: 'copy-design-tokens',
    closeBundle() {
      copyFileSync(
        fileURLToPath(new URL('./src/design-tokens.css', import.meta.url)),
        fileURLToPath(new URL('./dist/design-tokens.css', import.meta.url)),
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [
    react(),
    tailwindcss(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.app.json',
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx', '**/setupTests.ts'],
    }),
    copyDesignTokens(),
  ],
  resolve: {
    alias: {
      '@/Components': fileURLToPath(new URL('./src/Components', import.meta.url)),
      '@/Internal': fileURLToPath(new URL('./src/Internal', import.meta.url)),
      '@/Shared': fileURLToPath(new URL('./src/Shared', import.meta.url)),
      '@/States': fileURLToPath(new URL('./src/States', import.meta.url)),
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
