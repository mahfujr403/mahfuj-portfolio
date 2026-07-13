export interface Blog {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  authorImage?: string;
  publishedDate: string;
  updatedDate?: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  readTime?: string;
}

export interface Comment {
  id: string;
  blogId: string;
  author: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string | null;
  replies?: Comment[];
}

export interface CommentFormData {
  author: string;
  authorEmail?: string;
  content: string;
  parentId?: string | null;
}
