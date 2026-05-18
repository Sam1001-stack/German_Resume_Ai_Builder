"use client";

import { PageTransition } from "@/components/shared/page-transition";
import { Logo } from "@/components/shared/logo";
import { Link } from "@/i18n/routing";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800 p-12 text-white lg:flex">
        <Logo className="text-white [&_span]:text-white" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ResumeAI</h2>
          <p className="mt-4 max-w-md text-lg text-violet-100">
            AI-powered resumes for the German and global job market.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 opacity-80">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-white/10 backdrop-blur" />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-8 lg:w-1/2 lg:px-16">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <PageTransition>
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <p className="mt-8 text-center text-sm text-zinc-500">
              <Link href="/" className="hover:text-violet-600">
                ← Back to home
              </Link>
            </p>
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
