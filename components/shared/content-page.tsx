import { PageTransition } from "@/components/shared/page-transition";

interface ContentPageProps {
  title: string;
  children?: React.ReactNode;
}

export function ContentPage({ title, children }: ContentPageProps) {
  return (
    <PageTransition>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <div className="prose prose-zinc mt-8 dark:prose-invert">
          {children ?? (
            <p className="text-zinc-600 dark:text-zinc-400">
              Content coming soon. This page is part of the ResumeAI platform.
            </p>
          )}
        </div>
      </article>
    </PageTransition>
  );
}
