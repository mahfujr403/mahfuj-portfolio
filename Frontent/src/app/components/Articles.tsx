import { Clock, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "../../services/articlesApi";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch {
    return dateStr;
  }
}

export default function Articles({ articles: propArticles }: { articles?: any[] }) {
  const { data: hookList = [], isLoading: loading } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchArticles,
    enabled: !propArticles,
  });
  const list = propArticles ?? hookList;
  const showSkeleton = loading && !propArticles;

  return (
    <section id="articles" className="py-20 lg:py-28 border-b border-border-subtle relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Editorial Section Header */}
        <div className="mb-12 lg:mb-16 text-left">
          {/* Section Index Marker */}
          <div className="flex items-center gap-2 mb-4 select-none" aria-hidden="true">
            <span className="text-xs font-mono tracking-widest text-primary font-semibold">05</span>
            <span className="text-xs text-border-active">/</span>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Writing</span>
          </div>

          {/* Section Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-display text-foreground tracking-tight leading-[1.15] mb-4">
            Technical Writing &amp; Case Studies
          </h2>

          {/* Factual Context - Unmodified Existing Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Deep dives into deep learning research, model optimization, FastAPI deployment, and production ML architecture.
          </p>
        </div>

        {/* Editorial Technical Writing Archive */}
        <div className="w-full border-t border-border-subtle divide-y divide-border/60">
          {showSkeleton ? (
            <div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-8 sm:py-9 animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
                    <div className="md:col-span-8 lg:col-span-9 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-20 bg-secondary/70 rounded" />
                        <div className="h-4 w-24 bg-secondary/40 rounded" />
                      </div>
                      <div className="h-6 w-3/4 bg-secondary/80 rounded" />
                      <div className="h-4 w-full bg-secondary/40 rounded" />
                      <div className="h-4 w-2/3 bg-secondary/30 rounded" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-5 w-16 bg-secondary/50 rounded" />
                        <div className="h-5 w-20 bg-secondary/50 rounded" />
                      </div>
                    </div>
                    <div className="md:col-span-4 lg:col-span-3 flex md:flex-col md:items-end justify-between gap-3">
                      <div className="h-4 w-24 bg-secondary/40 rounded hidden md:block" />
                      <div className="h-4 w-20 bg-secondary/60 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-sm font-mono text-muted-foreground">
              No technical articles available in the archive at this time.
            </div>
          ) : (
            list.map((article) => {
              const category = (article as any).platform ?? article.category ?? "Engineering Note";
              const isExternal = Boolean((article as any).externalUrl);
              const targetHref = (article as any).externalUrl || `/blog/${article.slug}`;

              const ContentWrapper = isExternal ? "a" : Link;
              const linkProps = isExternal
                ? { href: targetHref, target: "_blank", rel: "noopener noreferrer" }
                : { to: targetHref };

              return (
                <ContentWrapper
                  key={article.id || article.slug}
                  {...(linkProps as any)}
                  className="block group py-8 sm:py-9 transition-colors hover:bg-secondary/15 px-3 sm:px-5 -mx-3 sm:-mx-5 rounded-[10px]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
                    {/* Left/Main Column: Metadata, Title, Summary, Tags */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-2.5">
                      {/* Category, Date & Read Time metadata strip */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-muted-foreground select-none">
                        <span className="text-primary font-medium uppercase tracking-wider">
                          {category}
                        </span>
                        <span className="text-border-active md:hidden" aria-hidden="true">•</span>
                        <time dateTime={article.publishedDate} className="md:hidden">
                          {formatDate(article.publishedDate)}
                        </time>
                        {article.readTime && (
                          <>
                            <span className="text-border-active" aria-hidden="true">•</span>
                            <span className="flex items-center gap-1 text-muted-foreground/90">
                              <Clock size={11} className="text-muted-foreground shrink-0" />
                              <span>{article.readTime}</span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Article Title */}
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold font-display text-foreground group-hover:text-primary transition-colors leading-snug">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      {article.summary && (
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-2">
                          {article.summary}
                        </p>
                      )}

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {article.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex items-center text-[11px] font-mono text-muted-foreground/80 px-2 py-0.5 rounded-[4px] bg-[#18202E] border border-border/60"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Column: Date & Action Link */}
                    <div className="md:col-span-4 lg:col-span-3 flex md:flex-col md:items-end justify-between md:justify-start gap-3 pt-0.5">
                      <time dateTime={article.publishedDate} className="text-xs font-mono text-muted-foreground hidden md:block">
                        {formatDate(article.publishedDate)}
                      </time>
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors md:mt-2">
                        <span>Read article</span>
                        <ArrowUpRight size={14} className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </ContentWrapper>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
