import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { ArrowLeft, Clock, Calendar, User, MessageCircle, Send } from "lucide-react";
import { CommentFormData } from "../../types/blog";
import { fetchBlogBySlug, fetchCommentsByBlogId, postComment as apiPostComment } from "../../services/blogApi";
import { toast } from "sonner";
import DOMPurify from "dompurify";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentForm, setCommentForm] = useState<CommentFormData>({
    author: "",
    authorEmail: "",
    content: "",
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (!slug) return;
        const b = await fetchBlogBySlug(slug);
        if (mounted) setBlog(b);
        if (b) {
          const comm = await fetchCommentsByBlogId(b.id as any);
          if (mounted) setComments(comm ?? []);
        }
      } catch (e) {
        toast.error("Failed to load blog post or comments");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Ensure page is scrolled to top when navigating to a blog detail
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {
      // No-op in non-browser environments
    }
  }, [slug]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog?.id || !commentForm.author.trim() || !commentForm.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const created = await apiPostComment(blog.id as any, commentForm as any);
      setComments((c) => [...c, created]);
      setCommentForm({ author: "", authorEmail: "", content: "" });
      toast.success("Comment posted successfully!");
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="mb-4 text-gray-100">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="mb-4 text-gray-100">Blog Post Not Found</h1>
          <p className="text-gray-400 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/" className="text-gray-400 hover:text-[#00f2fe] transition-colors inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f2fe] transition-colors mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {blog.imageUrl && (
          <div className="w-full h-96 rounded-2xl overflow-hidden mb-8 border border-white/10">
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <article className="glass border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge className="bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-black border-0">{blog.category}</Badge>
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-white/20 text-gray-300">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="mb-6 gradient-text">{blog.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#00f2fe]" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#8b5cf6]" />
              <span>{formatDate(blog.publishedDate)}</span>
            </div>
            {blog.readTime && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#ec4899]" />
                <span>{blog.readTime}</span>
              </div>
            )}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">{blog.summary}</p>
            <div
  className="prose prose-invert max-w-none prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-a:text-[#00f2fe] prose-pre:bg-black/40 prose-code:text-[#00f2fe]"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(blog.content || ""),
  }}
/>
          </div>
        </article>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-100">
              <MessageCircle size={20} className="text-[#00f2fe]" />
              Discussion ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
                      Name <span className="text-[#00f2fe]">*</span>
                    </label>
                    <Input
                      id="author"
                      type="text"
                      placeholder="Your name"
                      value={commentForm.author}
                      onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                      required
                      className="bg-black/30 border-white/10 text-gray-100 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email (optional)
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={commentForm.authorEmail}
                      onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
                      className="bg-black/30 border-white/10 text-gray-100 placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                    Comment <span className="text-[#00f2fe]">*</span>
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts..."
                    rows={4}
                    value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    required
                    className="bg-black/30 border-white/10 text-gray-100 placeholder:text-gray-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-black font-semibold hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-12 bg-black/20 border border-white/5 rounded-lg">
                  <MessageCircle size={48} className="mx-auto mb-3 text-gray-600" />
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-[#00f2fe]/30 pl-4 py-2 bg-black/10 rounded-r-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-200">{comment.author}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{comment.content}</p>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="border-l-2 border-[#8b5cf6]/30 pl-4 py-2 bg-black/10 rounded-r-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-gray-200">{reply.author}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(reply.createdAt)}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-400 leading-relaxed">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
