import { apiFetch } from "./apiClient";

export async function fetchSkills() {
  const res = await apiFetch<{ data: Array<{ category: string; skills: Array<{ name: string; level: number }> }> }>("api/v1/skills");
  return res.data;
}

export default { fetchSkills };
