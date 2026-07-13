import { Blog, Comment, CommentFormData } from "../types/blog";
import { apiFetch } from "./apiClient";

/**
 * NOTE: These API functions are currently not in use.
 * The app uses local mock data from src/data/blogs.ts
 *
 * To connect to your external database API:
 * 1. Set API_BASE_URL to your actual API endpoint above
 * 2. Update BlogDetailPage.tsx to import and use these functions
 * 3. Make sure your API endpoints match the patterns below
 */

/**
 * Fetch all blogs from the database
 */
export async function fetchAllBlogs(): Promise<Blog[]> {
  try {
    return await apiFetch<Blog[]>("api/v1/blogs");
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
}

/**
 * Fetch a single blog by slug
 */
export async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    return await apiFetch<Blog>(`api/v1/blogs/${slug}`);
  } catch (error) {
    console.error(`Error fetching blog with slug ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetch comments for a specific blog
 */
export async function fetchCommentsByBlogId(blogId: string): Promise<Comment[]> {
  try {
    return await apiFetch<Comment[]>(`api/v1/blogs/${blogId}/comments`);
  } catch (error) {
    console.error(`Error fetching comments for blog ${blogId}:`, error);
    throw error;
  }
}

/**
 * Post a new comment to a blog
 */
export async function postComment(
  blogId: string,
  commentData: CommentFormData
): Promise<Comment> {
  try {
    return await apiFetch<Comment>(`api/v1/blogs/${blogId}/comments`, {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  } catch (error) {
    console.error(`Error posting comment to blog ${blogId}:`, error);
    throw error;
  }
}

/**
 * Post a reply to an existing comment
 */
export async function postReply(
  blogId: string,
  parentCommentId: string,
  commentData: CommentFormData
): Promise<Comment> {
  try {
    return await apiFetch<Comment>(
      `api/v1/blogs/${blogId}/comments/${parentCommentId}/replies`,
      {
        method: "POST",
        body: JSON.stringify(commentData),
      }
    );
  } catch (error) {
    console.error(`Error posting reply to comment ${parentCommentId}:`, error);
    throw error;
  }
}
