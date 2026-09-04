const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  // Do not attach Content-Type to bodyless GET requests: it turns a simple
  // cross-origin request into an extra CORS preflight.
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API request failed: ${res.status} ${res.statusText} ${text}`);
  }
  return (await res.json()) as T;
}

export default { getApiBaseUrl, apiFetch };
