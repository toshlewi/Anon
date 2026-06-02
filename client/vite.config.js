import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@splinetool/react-spline")) return "spline";
          if (id.includes("react-router-dom") || id.includes("react-dom") || id.includes("/react/")) return "react";
          return undefined;
        },
      },
    },
  },
});
