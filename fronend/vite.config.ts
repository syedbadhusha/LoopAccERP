import { defineConfig } from "vite";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), "");

  return {
    server: {
      host: env.VITE_DEV_HOST || "::",
      port: Number(env.VITE_DEV_PORT || 8080),
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean,
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    root: path.resolve(__dirname),
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return;
            }

            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("scheduler")
            ) {
              return "vendor-react";
            }

            if (id.includes("react-router")) {
              return "vendor-router";
            }

            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }

            if (id.includes("recharts") || id.includes("d3-")) {
              return "vendor-charts";
            }

            if (
              id.includes("react-hook-form") ||
              id.includes("@hookform") ||
              id.includes("zod")
            ) {
              return "vendor-forms";
            }

            if (id.includes("@tanstack")) {
              return "vendor-query";
            }

            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }

            return "vendor-misc";
          },
        },
      },
    },
  };
});
