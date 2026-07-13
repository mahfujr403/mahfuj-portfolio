import { apiFetch } from "./apiClient";

export async function submitContact(payload: any) {
  return await apiFetch("api/v1/contact", { method: "POST", body: JSON.stringify(payload) });
}

export async function getContactComments(limit = 10, offset = 0) {
  return await apiFetch<any[]>(`api/v1/contact/comments?limit=${limit}&offset=${offset}`);
}

export default { submitContact, getContactComments };
