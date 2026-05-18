"use client";

import { useApiBaseUrl } from "@/lib/api";

export default function Home() {
  const apiUrl = useApiBaseUrl();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          German Resume Builder
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Lebenslauf erstellen
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Build a German-style CV with the Next.js client and Express API.
          Start the server, connect MongoDB, then develop your resume flows
          here.
        </p>
        <p className="mt-6 text-sm text-zinc-500">
          API base URL:{" "}
          <code className="rounded bg-zinc-100 px-2 py-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            {apiUrl}
          </code>
        </p>
      </main>
    </div>
  );
}
