import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/config/site";

interface PageSeoProps {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
}

export function createPageMetadata({
  locale,
  title,
  description,
  path = "",
}: PageSeoProps): Metadata {
  const url = `${siteConfig.url}/${locale}${path}`;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${path}`,
        de: `${siteConfig.url}/de${path}`,
      },
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export function createJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    description: siteConfig.description,
  };
}
