import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const baseUrl =
          process.env.SITE_URL || (request ? new URL(request.url).origin : "https://deenlearn.com");
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/auth", changefreq: "yearly", priority: "0.3" },
          { path: "/register-course", changefreq: "monthly", priority: "0.8" },
          { path: "/terms", changefreq: "yearly", priority: "0.2" },
          { path: "/privacy", changefreq: "yearly", priority: "0.2" },
        ];
        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${baseUrl}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
