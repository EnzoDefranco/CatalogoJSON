import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify'; // ⬅️ importa el adaptador

export default defineConfig({
  integrations: [
    react(),
  ],
  adapter: netlify(),      // ⬅️ usa el adaptador
  output: 'server',        // ⬅️ obligatorio para usar rutas API como /api/products
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
      },
    },
    plugins: [
      tailwindcss(),
    ],
  },
});
