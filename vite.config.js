// // import react from '@vitejs/plugin-react'
// // import { defineConfig } from 'vite'

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],

//   server: {
//     proxy: {
//       "/api": {
//         target:
//           "https://nse-data-sync-60066676245.development.catalystserverless.in",

//         changeOrigin: true,
//         secure: true,

//         rewrite: (path) =>
//           path.replace(
//             /^\/api/,
//             "/server/scrip_api"
//           ),
          
//       },
//     },
//   },
// });
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],

//   server: {
//     proxy: {
//       // Existing scrip_api
//       "/api": {
//         target:
//           "https://nse-data-sync-60066676245.development.catalystserverless.in",
//         changeOrigin: true,
//         secure: true,
//         rewrite: (path) =>
//           path.replace(/^\/api/, "/server/scrip_api"),
//       },

//       // New staging_upload function
//       "/staging-upload-api": {
//         target:
//           "https://nse-data-sync-60066676245.development.catalystserverless.in",
//         changeOrigin: true,
//         secure: true,

        
//         rewrite: (path) =>
//           path.replace(
//             /^\/staging-upload-api/,
//             "/staging"
//           ),
//       },
//     },
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const CATALYST_DOMAIN =
  "https://nse-data-sync-60066676245.development.catalystserverless.in";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: CATALYST_DOMAIN,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/server/scrip_api"),
      },

      "/staging-upload-api": {
        target: CATALYST_DOMAIN,
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
           path.replace(/^\/staging-upload-api\/upload/, "/staging/upload"),
      },
    },
  },
});