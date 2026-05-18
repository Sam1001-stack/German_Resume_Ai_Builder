import { useSyncExternalStore } from "react";

const LOCAL_API_URL = "http://localhost:5000/api";
const PROD_API_URL =
  "https://germanresumeaibuilderbackend-production.up.railway.app/api";

const isLocalHostname = (hostname: string) =>
  hostname === "localhost" || hostname === "127.0.0.1";

/** API base URL: local backend in dev, Railway when deployed (e.g. Vercel). */
export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "development"
      ? LOCAL_API_URL
      : PROD_API_URL;
  }
  return isLocalHostname(window.location.hostname)
    ? LOCAL_API_URL
    : PROD_API_URL;
}

export function useApiBaseUrl(): string {
  return useSyncExternalStore(
    () => () => {},
    getApiBaseUrl,
    () =>
      process.env.NODE_ENV === "development" ? LOCAL_API_URL : PROD_API_URL
  );
}

export { LOCAL_API_URL, PROD_API_URL };
