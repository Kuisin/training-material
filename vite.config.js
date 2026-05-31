import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tsxMpaPlugin } from './vite-mpa-plugin.js';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  appType: 'mpa',
  plugins: [react(), tsxMpaPlugin({ root }), tailwindcss()],
  base: process.env.BASE_PATH || '/',
  server: {
    port: 5173,
    strictPort: false,
    open: '/',
  },
  preview: {
    port: 4173,
    open: '/',
  },
  build: {
    outDir: 'dist',
  },
});
