import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';

const frontendRoot = new URL('./', import.meta.url).pathname;

// The Shelby firmware serves data/ verbatim from LittleFS at the device root
// (`serveStatic("/", LittleFS, "/").setDefaultFile("index.html")`), so the
// production build must land in ../data with a relative base. Device API paths
// under /api/* and /healthcheck/* are reserved by the firmware; Vite only ever
// emits assets under /assets/* plus index.html.
//
// During development the device on the LAN is the backend. Its firmware does
// not send CORS headers, so the Vite dev server proxies the reserved /api/*
// and /healthcheck/* paths to VITE_DEV_API_TARGET. This server.proxy config is
// serve-only: `vite build` emits exactly the same relative same-origin assets
// as before, and the production output has no proxy or absolute target baked in.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, frontendRoot, '');
  const apiTarget = env.VITE_DEV_API_TARGET?.trim();
  let server;

  if (command === 'serve') {
    if (apiTarget) {
      server = {
        proxy: {
          '/api': { target: apiTarget, changeOrigin: true, ws: false },
          '/healthcheck': { target: apiTarget, changeOrigin: true, ws: false },
        },
      };
    } else {
      console.warn(
        '[vite] VITE_DEV_API_TARGET is not set in frontend/.env — requests to /api/* and /healthcheck/* will not reach the device',
      );
    }
  }

  return {
    base: './',
    plugins: [preact()],
    ...(server ? { server } : {}),
    build: {
      outDir: '../data',
      emptyOutDir: true,
      // Keep CSS/JS as separate /assets files (never inline into index.html) so
      // the ESP32 does not have to push a single oversized HTML document.
      assetsInlineLimit: 4096,
      // Compact, dependency-light output for a heap-constrained device.
      sourcemap: false,
      cssCodeSplit: false,
      reportCompressedSize: false,
    },
  };
});
