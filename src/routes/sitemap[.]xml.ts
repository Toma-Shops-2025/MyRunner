import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

const entries = [
  { path: "/", priority: "1.0", changefreq: "weekly" as const },
  { path: "/how-it-works", priority: "0.8", changefreq: "monthly" as const },
  { path: "/pricing", priority: "0.9", changefreq: "monthly" as const },
  { path: "/drivers", priority: "0.9", changefreq: "monthly" as const },
  { path: "/driver-signup", priority: "0.7", changefreq: "monthly" as const },
  { path: "/safety", priority: "0.7", changefreq: "monthly" as const },
  { path: "/about", priority: "0.6", changefreq: "yearly" as const },
  { path: "/contact", priority: "0.6", changefreq: "yearly" as const },
  { path: "/faq", priority: "0.8", changefreq: "monthly" as const },
  { path: "/terms", priority: "0.4", changefreq: "yearly" as const },
  { path: "/privacy", priority: "0.4", changefreq: "yearly" as const },
  { path: "/cookies", priority: "0.3", changefreq: "yearly" as const },
  { path: "/community-guidelines", priority: "0.5", changefreq: "yearly" as const },
  { path: "/refund-policy", priority: "0.4", changefreq: "yearly" as const },
  { path: "/accessibility", priority: "0.3", changefreq: "yearly" as const },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) => [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            `    <changefreq>${e.changefreq}</changefreq>`,
            `    <priority>${e.priority}</priority>`,
            `  </url>`,
          ].join("\n")),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
