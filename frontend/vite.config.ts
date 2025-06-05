import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

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
    plugins: [react(), tsconfigPaths()],
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
