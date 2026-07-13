const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API request failed: ${res.status} ${res.statusText} ${text}`);
  }
  return (await res.json()) as T;
}

export default { getApiBaseUrl, apiFetch };
