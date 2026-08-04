import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/site";

const explicitlyAllowedCrawlers = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "OAI-AdsBot",
  "GPTBot",
  "PerplexityBot",
  "Google-Extended",
  "ClaudeBot",
  "Applebot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      ...explicitlyAllowedCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
