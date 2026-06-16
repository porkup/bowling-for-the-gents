import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Change the base to match your GitHub repo name, e.g. "/bowling-for-the-gents/"
export default defineConfig({
  plugins: [react()],
  base: "/bowling-for-the-gents/",
});
