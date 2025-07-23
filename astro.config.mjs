// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    react(),            // habilita .tsx/.jsx
  ],
  vite: {
    resolve: {
      alias: {
        // Opcional: para que @components/… apunte a src/components
        '@components': '/src/components',
      },
    },
    plugins: [
      tailwindcss(),
    ],
  },
});
