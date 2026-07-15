import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Base path для GitHub Pages project site (https://<user>.github.io/gof-patterns/)
// Для локального dev — Astro отдаёт на http://localhost:4321/gof-patterns/
export default defineConfig({
  base: '/gof-patterns',
  integrations: [react(), tailwind()],
  server: {
    host: '0.0.0.0',
    port: 4321
  }
});
