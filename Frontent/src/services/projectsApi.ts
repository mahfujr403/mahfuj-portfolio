import { apiFetch } from "./apiClient";

export async function listProjects(limit = 20, offset = 0): Promise<any[]> {
  return await apiFetch<any[]>(`api/v1/projects?limit=${limit}&offset=${offset}`);
}

export async function getProjectBySlug(slug: string): Promise<any | null> {
  return await apiFetch<any>(`api/v1/projects/${slug}`);
}

export default { listProjects, getProjectBySlug };
