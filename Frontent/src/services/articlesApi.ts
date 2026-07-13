import type { Blog } from "../types/blog";
import { apiFetch } from "./apiClient";

export async function fetchArticles(): Promise<Blog[]> {
  return await apiFetch<Blog[]>("api/v1/blogs");
}

export async function fetchArticleBySlug(slug: string): Promise<Blog | null> {
  return await apiFetch<Blog>(`api/v1/blogs/${slug}`);
}

export default { fetchArticles, fetchArticleBySlug };
