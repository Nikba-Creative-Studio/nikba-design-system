import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: resolve(import.meta.dirname, 'playground'),
  build: {
    outDir: resolve(import.meta.dirname, 'dist-playground'),
    emptyOutDir: true,
    rollupOptions: {
      input: [
        resolve(import.meta.dirname, 'playground/index.html'),
        resolve(import.meta.dirname, 'playground/foundations.html'),
        resolve(import.meta.dirname, 'playground/mcp.html'),
        resolve(import.meta.dirname, 'playground/components/index.html'),
        resolve(import.meta.dirname, 'playground/components/button.html'),
        resolve(import.meta.dirname, 'playground/components/link.html'),
        resolve(import.meta.dirname, 'playground/components/badge-chip.html'),
        resolve(import.meta.dirname, 'playground/components/field.html'),
        resolve(import.meta.dirname, 'playground/components/input-textarea.html'),
        resolve(import.meta.dirname, 'playground/components/select.html'),
        resolve(import.meta.dirname, 'playground/components/checkbox-radio.html'),
        resolve(import.meta.dirname, 'playground/components/switch.html'),
        resolve(import.meta.dirname, 'playground/components/card.html'),
        resolve(import.meta.dirname, 'playground/components/divider.html'),
        resolve(import.meta.dirname, 'playground/components/avatar.html'),
        resolve(import.meta.dirname, 'playground/components/spinner.html'),
        resolve(import.meta.dirname, 'playground/components/skeleton.html'),
        resolve(import.meta.dirname, 'playground/components/alert.html'),
        resolve(import.meta.dirname, 'playground/components/disclosure-accordion.html'),
        resolve(import.meta.dirname, 'playground/components/tabs.html'),
        resolve(import.meta.dirname, 'playground/components/dialog.html'),
        resolve(import.meta.dirname, 'playground/components/popover-menu.html'),
      ],
    },
  },
});
