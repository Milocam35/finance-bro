import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: "all",
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL || process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
      },
      "/health": {
        target: process.env.BACKEND_URL || process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
      },
      "/auth": {
        target: process.env.USERS_API_URL || process.env.VITE_USERS_API_URL || "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ""),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
