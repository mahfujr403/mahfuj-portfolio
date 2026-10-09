import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { ArrowLeft, Clock, Calendar, User, MessageCircle, Send, BookOpen } from "lucide-react";
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
      } catch {
        toast.error("Failed to load article or discussion comments");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {
      // ignore
    }
  }, [slug]);

  useEffect(() => {
    if (blog?.title) {
      document.title = `${blog.title} — Articles | Md. Mahfujur Rahman`;
    } else {
      document.title = "Technical Writing — Md. Mahfujur Rahman";
    }
  }, [blog?.title]);

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
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-pulse">
          <div className="h-8 w-48 bg-secondary/60 rounded-md mx-auto mb-4" />
          <div className="h-4 w-72 bg-secondary/40 rounded-md mx-auto" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-card border border-border rounded-[10px]">
          <h1 className="text-2xl font-bold font-display text-foreground mb-3">Article Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">The requested publication or technical article does not exist.</p>
          <Link to="/#articles" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm">
            ← Return to Articles
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
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/#articles"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </Link>

        {blog.imageUrl && (
          <div className="w-full h-72 sm:h-96 rounded-xl overflow-hidden mb-8 border border-border bg-secondary/30">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement | null)?.style.setProperty('display', 'none');
              }}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <article className="bg-card border border-border rounded-xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default" className="text-xs">
              <BookOpen size={11} className="mr-1" />
              {blog.category}
            </Badge>
            {blog.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-foreground tracking-tight mb-4 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mb-8 pb-5 border-b border-border/60">
            <div className="flex items-center gap-1.5">
              <User size={13} className="text-primary" />
              <span>{blog.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-primary" />
              <span>{formatDate(blog.publishedDate)}</span>
            </div>
            {blog.readTime && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-primary" />
                  <span>{blog.readTime}</span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-6">
            <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed text-left">
              {blog.summary}
            </p>

            <div
              className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-left text-sm sm:text-base prose-headings:font-display prose-headings:text-foreground prose-a:text-primary hover:prose-a:underline prose-code:font-mono prose-code:text-primary prose-pre:bg-background prose-pre:border prose-pre:border-border prose-img:rounded-xl prose-img:border prose-img:border-border"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content || ""),
              }}
            />
          </div>
        </article>

        {/* Discussion Card */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground font-display text-lg">
              <MessageCircle size={18} className="text-primary" />
              <span>Discussion & Review ({comments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitComment} className="mb-8 p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="author" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Name <span className="text-primary">*</span>
                    </label>
                    <Input
                      id="author"
                      type="text"
                      placeholder="Your name"
                      value={commentForm.author}
                      onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Email (optional)
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={commentForm.authorEmail}
                      onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="content" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Comment <span className="text-primary">*</span>
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts or technical perspectives..."
                    rows={4}
                    value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all text-xs"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="size-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      <span>Posting...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Send size={13} />
                      <span>Post Comment</span>
                    </span>
                  )}
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-10 rounded-lg border border-border bg-secondary/20">
                  <MessageCircle size={32} className="mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-xs font-mono text-muted-foreground">No commentary submitted yet.</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-primary/50 pl-4 py-2 bg-secondary/20 rounded-r-lg">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{comment.author}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{comment.content}</p>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 ml-4 space-y-3">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="border-l-2 border-border pl-3 py-1.5 bg-secondary/30 rounded-r-lg">
                            <p className="font-semibold text-foreground text-xs">{reply.author}</p>
                            <p className="text-[10px] font-mono text-muted-foreground mb-1">
                              {formatDate(reply.createdAt)}
                            </p>
                            <p className="text-muted-foreground text-xs leading-relaxed">{reply.content}</p>
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
