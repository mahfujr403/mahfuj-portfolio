import { apiFetch } from "./apiClient";

export async function listAchievements(limit = 20, offset = 0) {
  return await apiFetch<any[]>(`api/v1/achievements?limit=${limit}&offset=${offset}`);
}

export default { listAchievements };
