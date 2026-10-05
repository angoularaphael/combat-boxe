import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://combat-boxe.com',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  compressHTML: true,
  server: {
    port: 3310,
    host: true,
  },
});
