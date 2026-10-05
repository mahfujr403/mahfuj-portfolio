import { Badge } from "./ui/badge";
import { Clock, ArrowUpRight, PenLine, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "../../services/articlesApi";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function Articles({ articles: propArticles }: { articles?: any[] }) {
  const { data: hookList = [], isLoading: loading } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchArticles,
    enabled: !propArticles,
  });
  const list = propArticles ?? hookList;

  return (
    <section id="articles" className="py-20 lg:py-28 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-mono text-primary uppercase tracking-wider mb-3">
            <BookOpen size={13} />
            Engineering Insights
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground tracking-tight mb-3">
            Technical Writing & Case Studies
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Deep dives into deep learning research, model optimization, FastAPI deployment, and production ML architecture.
          </p>
        </motion.div>

        {/* Timeline list */}
        <div className="relative">
          {/* Hairline timeline track */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border/80 hidden md:block" />

          <div className="flex flex-col divide-y divide-border/60">
            {loading && !propArticles ? (
              <div className="space-y-6 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="md:pl-8 py-6 space-y-3 animate-pulse">
                    <div className="flex gap-3">
                      <div className="h-5 w-24 bg-secondary/60 rounded-md" />
                      <div className="h-5 w-20 bg-secondary/40 rounded-md" />
                    </div>
                    <div className="h-6 w-3/4 bg-secondary/70 rounded-lg" />
                    <div className="h-4 w-full bg-secondary/40 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              list.map((article, index) => {
                const platform = (article as any).platform ?? article.category ?? "Blog";
                return (
                  <Link
                    key={article.id}
                    to={`/blog/${article.slug}`}
                    className="block group"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 }}
                      className="relative md:pl-8 py-6 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-secondary/20 rounded-xl transition-all duration-150 cursor-pointer"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-8 w-2 h-2 rounded-full bg-border group-hover:bg-primary group-hover:scale-125 transition-all duration-150 hidden md:block -translate-x-[3.5px]" />

                      {/* Monospace index */}
                      <div className="shrink-0 w-8 text-right hidden sm:block">
                        <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="default" className="text-[11px] shrink-0">
                            <PenLine size={10} className="mr-1" />
                            {platform}
                          </Badge>
                          <span className="text-xs font-mono text-muted-foreground">
                            {formatDate(article.publishedDate)}
                          </span>
                          {article.readTime && (
                            <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                              <span>•</span>
                              <Clock size={11} className="text-primary" />
                              <span>{article.readTime}</span>
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors leading-snug mb-1.5 line-clamp-2">
                          {article.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3 text-left">
                          {article.summary}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {article.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-secondary/60 border border-border group-hover:border-border-active transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action arrow */}
                      <div className="shrink-0 self-center sm:self-start sm:mt-1.5">
                        <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary/50 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-150">
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
