import { HeroSection } from "@/features/landing/hero-section";
import { FeaturesSection } from "@/features/landing/features-section";
import { CtaSection } from "@/features/landing/cta-section";
import { createJsonLd } from "@/lib/seo";
import { ensureRequestLocale } from "@/lib/ensure-locale";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  ensureRequestLocale(locale);
  const jsonLd = createJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
