import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.js'),
      name: 'NikbaDesignSystem',
      fileName: 'nikba-design-system',
      cssFileName: 'nikba-design-system',
      formats: ['es'],
    },
  },
});
