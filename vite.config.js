// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target:
          "https://nse-data-sync-60066676245.development.catalystserverless.in",

        changeOrigin: true,
        secure: true,

        rewrite: (path) =>
          path.replace(
            /^\/api/,
            "/server/scrip_api"
          ),
      },
    },
  },
});