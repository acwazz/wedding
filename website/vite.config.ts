import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), solid()],
});
