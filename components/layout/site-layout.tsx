"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { usePathname } from "@/i18n/routing";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBuilder = pathname.startsWith("/builder");

  if (isBuilder) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
