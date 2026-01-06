// @ts-nocheck - vitest/vite plugin type compatibility issue
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./shared/test-utils/setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "e2e", "api-spec"],
    css: true,
    pool: "forks",
    deps: {
      optimizer: {
        web: {
          include: ["jsdom"],
        },
      },
    },
  },
});
