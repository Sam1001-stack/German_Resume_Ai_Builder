import { getApiBaseUrl } from "@/lib/api";

export function getSocketServerUrl(): string {
  const api = getApiBaseUrl();
  return api.replace(/\/api\/?$/, "");
}
