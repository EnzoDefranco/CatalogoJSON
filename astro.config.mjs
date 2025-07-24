// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify/functions';

export default defineConfig({
  // Genera un servidor para que tus rutas API bajo src/pages/api se conviertan
  // en funciones lambda de Netlify
  output: 'server',
  adapter: netlify(),

  integrations: [
    react(),         // tu integración de React
  ],

  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
      },
    },
    plugins: [
      tailwindcss(),  // Tailwind CSS
    ],
  },
});
