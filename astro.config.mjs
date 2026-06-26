import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  // Replace this with your actual production domain
  site: "https://adsrevenuecalculator.com",

  integrations: [sitemap(), react()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});