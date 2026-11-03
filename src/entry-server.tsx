/* Server-render van één route naar HTML (3 nov 2026, Mohammed: "laad snelheid ab ... het blijft soms witscherm als iemand
   op de pagina beland"). Gebruikt door scripts/prerender-lp.mjs na `vite build`: de advertentiepagina's krijgen hun HTML
   al in index.html, zodat de bezoeker kop en formulier ziet vóór het script geladen is. main.tsx hydrateert die HTML.
   renderToPipeableStream + onAllReady wacht op de lazy routes (renderToString zou alleen de fallback geven). */
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Writable } from "node:stream";
import { AppInhoud } from "./App";

export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    const uit = new Writable({
      write(chunk, _enc, cb) { html += chunk.toString(); cb(); },
    });
    uit.on("finish", () => resolve(html));
    const { pipe } = renderToPipeableStream(
      <QueryClientProvider client={new QueryClient()}>
        <StaticRouter location={url}>
          <AppInhoud />
        </StaticRouter>
      </QueryClientProvider>,
      {
        onAllReady() { pipe(uit); },
        onShellError(e) { reject(e); },
        onError(e) { reject(e); },
      },
    );
  });
}
