import { HeroSection } from "@/features/landing/hero-section";
import { FeaturesSection } from "@/features/landing/features-section";
import { CtaSection } from "@/features/landing/cta-section";
import { createJsonLd } from "@/lib/seo";

export default function HomePage() {
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
