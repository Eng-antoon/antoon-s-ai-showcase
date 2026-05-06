import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths({ projects: ["./tsconfig.json"] })],
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
});
