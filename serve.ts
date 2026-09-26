// Minimal static file server for previewing ./static-site without any build tools.
// Usage: bun static-site/serve.ts  (defaults to port 4173)
import { serve } from "bun";

const port = Number(process.env.PORT) || 4173;

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";

    const file = Bun.file(import.meta.dir + pathname);
    if (await file.exists()) {
      const ext = pathname.slice(pathname.lastIndexOf(".")).toLowerCase();
      return new Response(file, {
        headers: { "Content-Type": MIME[ext] ?? "application/octet-stream" },
      });
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Static site serving at http://localhost:${port}/`);
