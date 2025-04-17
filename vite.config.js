import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const config = ({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
      }),
    ],
    base: "",
    define: {
      "process.env.NODE_ENV": `"${mode}"`,
    },
    build: {
      outDir: "build",
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            return "vendor";
          },
        },
      },
    },
  });
};

export default config;
