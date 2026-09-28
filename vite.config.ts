import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/* Alleen de dev-server: /api/chat draait hier dezelfde functie als op Vercel.
   CHAT_NEP=1 gebruikt het nepmodel (scripts/chat-nep.mjs, geen sleutel, geen
   kosten); met ANTHROPIC_API_KEY in de omgeving het echte model. */
function chatDev(): Plugin {
  return {
    name: "chat-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        const mod = await server.ssrLoadModule("/api/chat.js");
        const nep = process.env.CHAT_NEP === "1" ? (await server.ssrLoadModule("/scripts/chat-nep.mjs")).nepClient : null;
        const handler = nep ? mod.maakHandler(nep) : mod.default;
        let ruw = "";
        for await (const deel of req) ruw += deel;
        (req as unknown as { body: unknown }).body = ruw ? JSON.parse(ruw) : {};
        const uit = {
          status(code: number) { res.statusCode = code; return uit; },
          json(o: unknown) { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(o)); return uit; },
        };
        await handler(req, uit);
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), chatDev()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
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
