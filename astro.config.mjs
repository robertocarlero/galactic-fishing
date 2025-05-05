// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import playformCompress from "@playform/compress";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [playformCompress()],
  adapter: netlify(),
  output: "server",
  image: {
    domains: ["avatar.iran.liara.run"],
  },
});
