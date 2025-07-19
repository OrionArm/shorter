import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import {
  VitePWA,
  type ManifestOptions,
  type VitePWAOptions,
} from "vite-plugin-pwa";

const manifest: Partial<ManifestOptions> = {
  name: "My PWA App",
  short_name: "PWA App",
  description: "My Progressive Web Application",
  theme_color: "#ffffff",
  background_color: "#ffffff",
  display: "standalone",
  orientation: "portrait-primary",
  scope: "/",
  start_url: "/",
  icons: [
    {
      src: "pwa-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "pwa-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "pwa-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
  shortcuts: [
    {
      name: "Главная",
      short_name: "Главная",
      url: "/",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
    {
      name: "Профиль",
      short_name: "Профиль",
      url: "/profile",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
  ],
  categories: ["productivity", "utilities"],
  screenshots: [
    {
      src: "screenshot-wide.png",
      sizes: "1280x720",
      type: "image/png",
      form_factor: "wide",
    },
    {
      src: "screenshot-narrow.png",
      sizes: "720x1280",
      type: "image/png",
      form_factor: "narrow",
    },
  ],
};

const pwaOptions: Partial<VitePWAOptions> = {
  strategies: "injectManifest",
  injectRegister: "auto",
  srcDir: "src",
  filename: "sw.ts",
  devOptions: {
    enabled: true,
    type: "module",
    navigateFallback: "index.html",
  },
  injectManifest: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2}"],
  },
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest,
};

//   plugins: [react(), VitePWA(pwaOptions)] as PluginOption[],

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, path.resolve(__dirname, ".."));

  for (const key of Object.keys(rootEnv)) {
    if (key.startsWith("VITE_")) {
      process.env[key] = rootEnv[key];
    }
  }
  const VITE_API_URL = JSON.stringify(rootEnv.VITE_API_URL);
  const VITE_PORT = parseInt(rootEnv.VITE_PORT);

  return {
    plugins: [react(), tsconfigPaths(), VitePWA(pwaOptions)],
    envPrefix: "VITE_",
    define: {
      __API_URL__: VITE_API_URL,
    },
    server: {
      port: VITE_PORT || 5173,
      host: "0.0.0.0",
    },
    build: {
      outDir: "dist",
    },
  };
});
