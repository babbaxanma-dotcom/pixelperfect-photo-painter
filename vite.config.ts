import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    chunkSizeWarningLimit: 900,
    // 3 nov 2026: manifest voor scripts/prerender-lp.mjs (welke CSS/JS hoort bij een LP-route); het script wist dist/.vite daarna,
    // zodat er geen bronbestandsnamen publiek staan. De server-build (isSsrBuild) krijgt geen manualChunks (react is daar extern).
    manifest: !isSsrBuild,
    rollupOptions: {
      output: isSsrBuild ? {} : {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          'router': ['react-router-dom'],
          'query': ['@tanstack/react-query'],
        },
        // Neutrale, hash-only bestandsnamen: geen herkenbare/verraderlijke
        // namen (lp-velux, LpDakwerken, ...) zichtbaar in de gebouwde HTML.
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash][extname]',
      },
    },
  },
}));
