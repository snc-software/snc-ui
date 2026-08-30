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

function fixCjsReactRequire(): Plugin {
  return {
    name: 'fix-cjs-react-require',
    enforce: 'pre',
    transform(code, id) {
      // use-sync-external-store's CJS shim does a bare, top-level
      // `require("react")`. Because it's inside a lazily-evaluated CJS
      // interop wrapper, Rollup can't hoist it to the externalized `react`
      // import and instead leaves a runtime require() call, which throws in
      // any browser (no global `require`) — including any consumer bundling
      // this package for browser use. Rewriting it to a real ESM import
      // here, before Rollup's CJS interop sees it, lets Rollup link it
      // normally to the externalized `react` binding.
      if (!id.includes('use-sync-external-store')) return null;
      if (!/require\(\s*["']react["']\s*\)/.test(code)) return null;
      const hoisted = "import __React from 'react';\n";
      const rewritten = code.replace(/require\(\s*["']react["']\s*\)/g, '__React');
      return { code: hoisted + rewritten, map: null };
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [
    fixCjsReactRequire(),
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
