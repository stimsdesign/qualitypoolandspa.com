// @ts-check 
/** Enables TypeScript type checking for this JavaScript configuration file */
// Import necessary modules
import { fontProviders } from "astro/config";
import { defineConfig } from 'astro/config';
// import { siteConfig } from './src/siteConfig';
import netlify from '@astrojs/netlify';

// Export the Astro configuration https://astro.build/config
export default defineConfig({
  // Sets default to static; use 'export const prerender = false;' in pages/APIs to opt-into SSR/Dynamic mode.
  output: 'static',
  // Host environment – Tells Astro how to build the site for specific platforms (Netlify, Node, etc.)
  adapter: netlify(),
  // Disable "Pretty URLs" in Netlify Dashboard.
  trailingSlash: 'never',
    fonts: [
        {
            provider: fontProviders.google(),
            name: 'Raleway',
            cssVariable: '--font-raleway',
            // weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
            weights: ['900']
        },
        {
            provider: fontProviders.google(),
            name: 'Quicksand',
            cssVariable: '--font-quicksand',
            // weights: ['300', '400', '500', '600', '700']
            weights: ['400', '700']
        },
        {
            provider: fontProviders.google(),
            name: 'Roboto Condensed',
            cssVariable: '--font-roboto-condensed',
            weights: ['500','900']
        },
    ],  
    build: {
        format: 'file' // Output pages as standalone .html files (e.g., /services.html) to support clean URLs (/services)
    },
    server: {
        host: true,   // or '0.0.0.0'
        port: 4321,
    },
    devToolbar: {
        enabled: false,
    },
});