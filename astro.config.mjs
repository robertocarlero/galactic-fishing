// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import playformCompress from "@playform/compress";

import netlify from "@astrojs/netlify";
import AstroPWA from "@vite-pwa/astro";

const sevenDaysInSeconds = 60 * 60 * 24 * 7;

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    playformCompress(),
    AstroPWA({
      mode: "production",
      base: "/",
      scope: "/",
      registerType: "autoUpdate",
      manifest: {
        name: "Galactic Fishing",
        short_name: "Galactic Fishing",
        theme_color: "#ffffff",
      },
      pwaAssets: {
        config: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2,webp}"],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "ssr-pages-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: sevenDaysInSeconds,
              },
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "static-images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: sevenDaysInSeconds,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/.netlify/images"),

            handler: "CacheFirst",
            options: {
              cacheName: "netlify-images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: sevenDaysInSeconds,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
  adapter: netlify(),
  output: "server",
  image: {
    domains: ["avatar.iran.liara.run"],
  },
});
