import type { MetadataRoute } from "next";
import { siteConfig, locales } from "@/config/site";

const paths = [
  "",
  "/features",
  "/pricing",
  "/templates",
  "/contact",
  "/sign-in",
  "/register",
  "/privacy",
  "/terms",
  "/cookies",
  "/faq",
  "/careers",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${siteConfig.url}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])
          ),
        },
      });
    }
  }

  return entries;
}
